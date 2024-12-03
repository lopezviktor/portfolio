const express = require('express');
const router = express.Router();
const Proyecto = require('../modelos/proyecto');

router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.getAll();
    res.render('proyectos', { title: 'Nuestros Proyectos', proyectos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;