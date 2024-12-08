const express = require('express');
const router = express.Router();
const Miembro = require('../modelos/miembro');

router.get('/', async (req, res) => {
  try {
    const miembros = await Miembro.getAll();
    res.render('miembros', { title: 'Nuestro Equipo', miembros });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const miembro = await Miembro.getById(req.params.id);
    console.log('Datos del miembro enviados a la plantilla:', miembro);
    if (miembro) {
      res.render('miembro-detalle', { miembro });
    } else {
      res.status(404).send('Miembro no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;