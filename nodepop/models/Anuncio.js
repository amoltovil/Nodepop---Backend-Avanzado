'use strict';

const mongoose = require('mongoose');

// definimos un esquema, le pasamos un objecto
// es opcional añadir la colección
// Al poner la opción de index:true creamos indice para el campo de la colección
const anuncioSchema = mongoose.Schema({
    nombre: {type:String, index:true}, 
    venta:  {type:Boolean, index:true},
    precio: {type:Number, index:true}, 
    foto: String,
    tags: [{type:String, index:true}]
}
, {
    collection: 'anuncios'  // para evitar la pluralizacion, le indicamos que colección va a usar
});

// En los métodos de mongoose no usar Arrow Functions para no tener problemas con el this
// es un método que no está dentro de mongoose
anuncioSchema.statics.lista = function (filtro, limit, skip, fields, sort){
    const query = Anuncio.find(filtro); // no devuelve una promesa, devuelve una query que tiene un método then
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    return query.exec(); // devuelve una promesa
};

// Método para listar los distintos tags definidos
anuncioSchema.statics.listaTags = function() {
    const query = Anuncio.find().distinct("tags");
    return query.exec();
};

// creamos el modelo con el esquema definido
const Anuncio = mongoose.model('Anuncio', anuncioSchema); 
// hace una pluralización para encontrar la coleccion en base de datos: agentes

//exportamos el modelo (opcional)
module.exports = Anuncio;