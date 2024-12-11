const express = require('express');
const exphbs = require('express-handlebars'); 
const path = require('path');
const moment = require('moment'); 

const app = express();

app.engine(
  'handlebars',
  exphbs.engine({
    helpers: {
      formatearFecha: (fecha) => moment(fecha).format('DD/MM/YYYY'), 
    },
  })
);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', require('./routes/index'));
app.use('/miembros', require('./routes/miembros'));
app.use('/proyectos', require('./routes/proyectos'));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));