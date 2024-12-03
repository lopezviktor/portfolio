const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { title: 'InFo+ TiK - Desarrollo Informático' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contacto - InFo+ TiK' });
});

module.exports = router;