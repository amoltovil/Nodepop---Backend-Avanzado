var express = require('express');
var router = express.Router();

// cargamos el modelo
const Anuncio = require('../../models/Anuncio');  

/* GET /apiv1/anuncios */
// 1ª versión de listar anuncios
//http://localhost:3000/apiv1/anuncios
router.get('/', async function(req, res, next) {
    // CON ASYNC AWAIT
    // 1ª Versión sin filtros 
    // try {
    
    //     const resultado = await Anuncio.find();
    //     res.json(resultado);

    // } catch (err){
    //     next(err);
    // }

    try {

        var precios = [];
        var vtags= [];
       
        const nombre = req.query.nombre;
        const venta = req.query.venta;
        const precio = req.query.precio;
        const tags = req.query.tags;

        const limit = parseInt(req.query.limit);  //lo convierte a num porque todo en req es string
        const skip = parseInt(req.query.skip);   // para paginar skip
        const fields = req.query.fields;
        const sort = req.query.sort;
        
        const filtro = {}
        if (nombre) {
            filtro.nombre = new RegExp('^' + nombre, "i")
           //filtro.nombre = nombre
        }
        if (venta) {
            filtro.venta = venta
        }
        if (precio) {
            if (precio.includes('-')) {
    
                precios = precio.split('-');
               
                if (precios.length == 2) {
                    if (!isNaN(parseFloat(precios[0])) && !isNaN(parseFloat(precios[1]))) {                        
                        filtro.precio ={ $gte: parseFloat(precios[0]), $lte: parseFloat(precios[1]) }
                    } else if (isNaN(parseFloat(precios[0])) && !isNaN(parseFloat(precios[1]))) {
                        // buscará los anuncios que sean menores a este precio    
                        filtro.precio ={ $lte: parseFloat(precios[1]) }
                    } else if (!isNaN(parseFloat(precios[0])) && isNaN(parseFloat(precios[1]))) {
                        // buscara los anuncios de precio mayor a este
                        filtro.precio ={ $gte: parseFloat(precios[0]) }
                    }      
                } 

            } else {
                // solo nos pasan un precio, buscaremos solo por este
                filtro.precio = precio
            }
        }
       // podremos buscar por varios tags separados por comas
        if (tags) {
            if (tags.includes(',')) {
               vtags = tags.split(',');
               filtro.tags = {$in: vtags};
            }
            } else {
               filtro.tags = {$in: tags};    
            }

        console.log(filtro)        
        const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort) 
        res.json(resultado);

    } catch (err){
        next(err);
    }
    
});

module.exports = router;