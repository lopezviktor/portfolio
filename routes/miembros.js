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
    if (miembro) {
      res.render('miembro-detalle', { title: `Perfil de ${miembro.nombre}`, miembro });
    } else {
      res.status(404).send('Miembro no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;