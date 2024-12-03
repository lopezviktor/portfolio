const db = require('../config/database');

class Proyecto {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT p.*, GROUP_CONCAT(t.nombre SEPARATOR ', ') AS tecnologias
      FROM proyectos p
      LEFT JOIN proyecto_tecnologias pt ON p.idProyecto = pt.proyecto_id
      LEFT JOIN tecnologias t ON pt.tecno_id = t.idTecno
      GROUP BY p.idProyecto
    `);
    return rows;
  }
}

module.exports = Proyecto;