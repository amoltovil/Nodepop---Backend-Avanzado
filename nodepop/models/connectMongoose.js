'use strict';

const mongoose = require('mongoose');

// eventos
mongoose.connection.on ('error', err=>{
    console.log('Error de conexión', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Conectado a BD.');
    //console.log('Conectado a MongoDB en', mongoose.connection.name);
});

// para evitar los futuros deprecator se añaden los parametros a la conexión {}
// parametros uri, opciones y devuelve una promesa
mongoose.connect(process.env.MONGODB_CONNECTION_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

module.exports = mongoose.connection; // no haria falta, pero queda más limpio
// hereda de un event emitter


