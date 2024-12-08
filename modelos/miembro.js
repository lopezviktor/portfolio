const db = require('../config/database');

class Miembro {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT m.*, 
             GROUP_CONCAT(JSON_OBJECT('id', t.idTecno, 'nombre', t.nombre)) AS tecnologias
      FROM miembros m
      LEFT JOIN miembro_tecnologias mt ON m.idMiembro = mt.miembro_id
      LEFT JOIN tecnologias t ON mt.tecno_id = t.idTecno
      GROUP BY m.idMiembro
    `);
    return rows.map(row => ({
      ...row,
      tecnologias: JSON.parse(`[${row.tecnologias}]`), // Convierte a un array de objetos
    }));
  }

  static async getById(id) {
    const [rows] = await db.query(`
        SELECT 
            m.idMiembro, m.nombre, m.apellidos, m.titulo, m.email,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', t.idTecno, 
                    'nombre', t.nombre, 
                    'nivel', mt.nivel
                )
            ) AS tecnologias
        FROM miembros m
        LEFT JOIN miembro_tecnologias mt ON m.idMiembro = mt.miembro_id
        LEFT JOIN tecnologias t ON mt.tecno_id = t.idTecno
        WHERE m.idMiembro = ?
        GROUP BY m.idMiembro
    `, [id]);

    if (rows.length) {
        const miembro = rows[0];

        // Manejo seguro del campo `tecnologias`
        try {
            if (typeof miembro.tecnologias === 'string') {
                miembro.tecnologias = JSON.parse(miembro.tecnologias); // Solo parsear si es una cadena
            }
        } catch (error) {
            console.error('Error al parsear tecnologias:', error);
            miembro.tecnologias = []; // Fallback a un array vacío si algo falla
        }

        return miembro;
    }
    return null;
  }
}

module.exports = Miembro;

