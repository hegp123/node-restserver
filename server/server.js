require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
console.log(path.resolve(__dirname, '../public'));
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URBDB, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos online...');
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto= ${process.env.PORT}`);
});