const db = require('../config/database');

class Miembro {
  static nivelToPorcentaje(nivel) {
    switch(nivel) {
      case 'Experto':
        return 100;
      case 'Avanzado':
        return 75;
      case 'Intermedio':
        return 50;
      default:
        return 0;
    }
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT m.*, 
             CONCAT('[', GROUP_CONCAT(
               CONCAT(
                 '{"id":', IFNULL(t.idTecno, 'null'), ',',
                 '"nombre":"', IFNULL(t.nombre, ''), '"}'
               )
             ), ']') AS tecnologias
      FROM miembros m
      LEFT JOIN miembro_tecnologias mt ON m.idMiembro = mt.miembro_id
      LEFT JOIN tecnologias t ON mt.tecno_id = t.idTecno
      GROUP BY m.idMiembro
    `);

    return rows.map(row => {
      let tecnologias = [];
      try {
        // Verificamos si `tecnologias` tiene contenido y lo parseamos
        tecnologias = row.tecnologias ? JSON.parse(row.tecnologias) : [];
        // Mapear nivel a porcentaje
        tecnologias = tecnologias.map(tecnologia => ({
          ...tecnologia,
          porcentaje: Miembro.nivelToPorcentaje(tecnologia.nivel)
        }));
      } catch (error) {
        console.error('Error al parsear tecnologias en getAll:', error);
      }
      return {
        ...row,
        tecnologias,
      };
    });
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT  
        m.idMiembro, 
        m.nombre, 
        m.apellidos, 
        m.titulo, 
        m.email,
        CONCAT('[', GROUP_CONCAT(
          CONCAT(
            '{"id":', IFNULL(t.idTecno, 'null'), ',',
            '"nombre":"', REPLACE(IFNULL(t.nombre, ''), '"', '\\"'), '",',
            '"nivel":"', REPLACE(IFNULL(mt.nivel, ''), '"', '\\"'), '"}'
          )
        SEPARATOR ','), ']') AS tecnologias
      FROM miembros m
      LEFT JOIN miembro_tecnologias mt ON m.idMiembro = mt.miembro_id
      LEFT JOIN tecnologias t ON mt.tecno_id = t.idTecno
      WHERE m.idMiembro = ?
      GROUP BY m.idMiembro;
    `, [id]);

    if (rows.length) {
      const miembro = rows[0];

      try {
        // Verificamos y parseamos el campo `tecnologias`
        miembro.tecnologias = miembro.tecnologias 
          ? JSON.parse(miembro.tecnologias) 
          : []; // Si no hay datos, asignamos un array vacío
        // Mapear nivel a porcentaje
        miembro.tecnologias = miembro.tecnologias.map(tecnologia => ({
          ...tecnologia,
          porcentaje: Miembro.nivelToPorcentaje(tecnologia.nivel)
        }));
      } catch (error) {
        console.error('Error al parsear tecnologias en getById:', error);
        miembro.tecnologias = []; // Fallback a un array vacío si algo falla
      }

      return miembro;
    }
    return null;
  }
}

module.exports = Miembro;
