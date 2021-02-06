'use strict';

const mongoose = require('mongoose');
require('../connectMongoose'); 
// Import the model
const Anuncio = require('../../models/Anuncio');
const anunciosData = require('./anuncios.json');

/*const pruebaAnuncio = new Anuncio ({
    nombre: "zapatillas", 
    venta: true, 
    precio: 30, 
    foto:"zapatillas.jpg",
    tag: ["lifestyle"] 
});

pruebaAnuncio.save(function (err, anuncioCreado){
    if (err) throw err;
    console.log('anuncio de prueba creado '+ anuncioCreado.nombre + ' creado');
});*/

//pruebaAnuncio.save();

async function initAnunciosDb(){
    const options = { ordered: true };
    if (Anuncio) {
        
        const promesa = Anuncio.deleteMany({});  
        try {
            const result = await promesa;
            // `0` if no docs matched the filter, number of docs deleted otherwise
            console.log("Deleted " + result.deletedCount + " documents");
        } catch(err) {
            console.log('Error al borrar la colección anuncios ', err);
        }
        const promesa2 = Anuncio.insertMany(anunciosData, options);
        try{
             const result2 = await promesa2;
             Anuncio.countDocuments({}, function(err, num_anuncios) {
                console.log('Inserted: ' + num_anuncios + ' documents in collection anuncios');
           });
             
        } catch(err) {
            console.log('Error de inserción masiva en la colección anuncios', err);
        }    
    } 
}

initAnunciosDb().catch(err=>{
    console.log('Error en el install_db de anuncios a la base de datos: ', err);
});


// async function insertaAnuncio() {
    
//     try {
//         const anuncioCreado = await pruebaAnuncio.save (); 
        
//         res.status(201).json({result:anuncioCreado});
//     }
//     catch(err) {
//       console.log('Error de creación anuncio', err);
//     }
    
// }

// insertaAnuncio().catch(err=>{
//     console.log('Error en la carga de un anuncio: ', err);
// });
