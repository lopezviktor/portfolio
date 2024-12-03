const db = require('../config/database');

class Miembro {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT m.*, GROUP_CONCAT(t.nombre SEPARATOR ', ') AS tecnologias
      FROM miembros m
      LEFT JOIN miembro_tecnologias mt ON m.idMiembro = mt.miembro_id
      LEFT JOIN tecnologias t ON mt.tecno_id = t.idTecno
      GROUP BY m.idMiembro
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT m.*, GROUP_CONCAT(t.nombre SEPARATOR ', ') AS tecnologias
      FROM miembros m
      LEFT JOIN miembro_tecnologias mt ON m.idMiembro = mt.miembro_id
      LEFT JOIN tecnologias t ON mt.tecno_id = t.idTecno
      WHERE m.idMiembro = ?
      GROUP BY m.idMiembro
    `, [id]);
    return rows[0];
  }
}

module.exports = Miembro;

