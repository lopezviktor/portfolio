const express = require('express');
const exphbs = require('express-handlebars'); // Usa express-handlebars
const path = require('path');
const moment = require('moment'); // Para formatear fechas

const app = express();

// Configuración de Handlebars
app.engine(
  'handlebars',
  exphbs.engine({
    helpers: {
      formatearFecha: (fecha) => moment(fecha).format('DD/MM/YYYY'), // Helper para formatear fechas
    },
  })
);
app.set('view engine', 'handlebars');

// Middleware para análisis del cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', require('./routes/index'));
app.use('/miembros', require('./routes/miembros'));
app.use('/proyectos', require('./routes/proyectos'));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));