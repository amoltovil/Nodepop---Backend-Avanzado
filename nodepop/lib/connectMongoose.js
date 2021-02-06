'use strict';

const mongoose = require('mongoose');

// eventos
mongoose.connection.on ('error', err=>{
    console.log('Error de conexión', err);
    process.exit(1);
});

mongoose.connection.once('open', ()=>{
console.log('Conectado a MongoDB en', mongoose.connection.name);
});

// para evitar los futuros deprecator se añaden los parametros a la conexión {}
// parametros uri, opciones y devuelve una promesa
mongoose.connect('mongodb://localhost/anuncios_db', { useNewUrlParser: true, useUnifiedTopology: true }); // uri y promesa

module.exports = mongoose.connection; // no haria falta, pero queda más limpio
// hereda de un event emitter
