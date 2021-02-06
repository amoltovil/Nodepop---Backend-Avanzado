var express = require('express');
var router = express.Router();

const Anuncio = require('../../models/Anuncio');  // cargamos el modelo

function filterByPrices(precio){
    var precios = [];
    let filterPrices ='';

    precios = precio.split('-').toString();
    
    if (precios.length === 2) {
        filterPrices ='{precio: {$gte: ' + precios[0] +', $lte: ' + precios[1] + '}}'
    }

    return filterPrices;
};

/* GET /api/anuncios */
// listar anuncios
router.get('/', async function(req, res, next) {

    try {

        var precios = [];
        var filterPrices;
    
        const nombre = req.query.nombre;
        const venta = req.query.venta;
        const precio = req.query.precio;
        const tags = req.query.tags;

        const limit = parseInt(req.query.limit);  //lo convierte a num porque todo en req es string
        const skip = parseInt(req.query.skip);   // para paginar skip
        const fields = req.query.fields;
        //http://localhost:3000/api/anuncios/?fields=age%20name%20-_id
        const sort = req.query.sort;
        //http://localhost:3000/api/anuncios/?sort=age%20-name
        // ordena por edad ascendente y edad descendente
    
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
                    // console.log(parseFloat(precios[0]))
                    // console.log(parseFloat(precios[1]))
                    // console.log(isNaN(parseFloat(precios[0])))
                    // console.log(isNaN(parseFloat(precios[1])))
                    if (!isNaN(parseFloat(precios[0])) && !isNaN(parseFloat(precios[1]))) {
                        //filterPrices ={precio: { $gte: ' + parseFloat(precios[0]) + ', $lte: '+ parseFloat(precios[1]) +' }}
                        filterPrices ={precio: { $gte: parseFloat(precios[0]), $lte: parseFloat(precios[1]) }}
                    } else if (isNaN(parseFloat(precios[0])) && !isNaN(parseFloat(precios[1]))) {
                        // buscará los anuncios que sean menores a este precio    
                        filterPrices ={precio: { $lte: parseFloat(precios[1]) }}
                    } else if (!isNaN(parseFloat(precios[0])) && isNaN(parseFloat(precios[1]))) {
                        // buscara los anuncios de precio mayor a este
                        filterPrices ={precio: { $gte: parseFloat(precios[0]) }}
                    }
            
                    filtro.precio = filterPrices
                    console.log(filterPrices);
                } 

            } else {
                console.log('entro en no contiene -')
                // solo nos pasan un precio, buscaremos solo por este
                filtro.precio = precio
                console.log(filtro.precio);
            }
      
        }
       
        if (tags) {
            filtro.tags = {$in: tags};
        }
        
        //throw new Error('fallo intencionado')
        //await Anuncio.find(); // funciona con una función async
        const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort)//await Anuncio.lista({ name : name});
        res.json(resultado);

    } catch (err){
        next(err);
    }
    
});

// GET /api/anuncios:id
// Obtener un anuncio por id
router.get('/:id', async (req, res, next)=>{
    try {
        const _id = req.params.id;

        const anuncio = await Anuncio.findOne({ _id: _id })

        if (!anuncio) {
            return res.status(404).json({error: 'not found'}); 
            // es lo mismo la sentencia de arriba a lo de aqui abajo
            //res.status(404).json({error: 'not found'}); 
            //return; 
        }
        res.json({result:anuncio});

    } catch(err) {
        next(err);
    }
});

//mio
// GET /api/anuncios:nombre
// Obtener un anuncio por nombre
// router.get('/:nombre', async (req, res, next)=>{
//     try {
//         const name = req.params.nombre;

//         const anuncio = await Anuncio.findOne({ name: nombre })

//         if (!anuncio) {
//             return res.status(404).json({error: 'not found'}); 
//             // es lo mismo la sentencia de arriba a lo de aqui abajo
//             //res.status(404).json({error: 'not found'}); 
//             //return; 
//         }
//         res.json({result:anuncio});

//     } catch(err) {
//         next(err);
//     }
// });

//POST /api/anuncios (body) crear un anuncio
router.post('/', async (req, res, next) => {
    try {
        
        const anuncioData = req.body;

        const anuncio = new Anuncio(anuncioData);   // crea una instancia de objecto Agente 
        // este es un método de instancia
        const anuncioCreado = await anuncio.save (); // lo guarda en base de datos
        
        res.status(201).json({result:anuncioCreado});

    } catch (error) {
        next(error);
    }
});

// PUT /api/anuncios:id (body)  (actualizar un anuncio, en el body le pasamos lo que queremos actualizar)
router.put('/:id', async (req, res, next) =>{
    try {
        const _id = req.params.id;
        const anuncioData = req.body;

        const anuncioActualizado = await Anuncio.findOneAndUpdate({_id:_id}, anuncioData, {
            new: true, 
            useFindAndModify: false
        });
        // usamos {new:true} para que nos devuelva el anuncio actualizado, para evitar el error
        // de deprecated añade useFindAndModify:false

        if (!anuncioActualizado){
            res.status(404).json({error: 'not found'});
            return;
        }

        res.json({result:anuncioActualizado});
    } catch (error) {
        next(error);
    }
});

// DELETE /api/anuncio: id
// elimina un anuncio
router.delete('/:id', async (req, res, next)=>{
    try {
        const _id = req.params.id;

        //await Anuncio.remove({_id:_id}); para evitar el error de la consola deprecated
        await Anuncio.deleteOne({_id:_id});
        res.json();

    } catch (error) {
        next(error);
    }
})

module.exports = router;