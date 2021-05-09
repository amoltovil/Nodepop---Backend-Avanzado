var express = require('express');
var router = express.Router();
const path = require('path');
const Anuncio = require('../../models/Anuncio');  // cargamos el modelo
const jwtAuth = require('../../lib/jwtAuth');
const multer = require('multer');
const cote = require('cote');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
                 cb(null, path.join(__dirname, '../../public/images/anuncios/'));
    },
    filename: function(req, file, cb) {
                 cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/**
 * GET /api/anuncios (listar anuncios)
 */
router.get('/', jwtAuth, async function(req, res, next) {

    try {

        console.log(`El usuario que está haciendo la petición es ${req.apiAuthUserId}`);

        var precios = [];
        var vtags=[];
    
        const nombre = req.query.nombre;
        const venta = req.query.venta;
        const precio = req.query.precio;
        const tags = req.query.tags;

        const limit = parseInt(req.query.limit);  //lo convierte a num porque todo en req es string
        const skip = parseInt(req.query.skip);   // para paginar skip
        const fields = req.query.fields;
        //http://localhost:3000/api/anuncios/?fields=precio%20nombre%20-_id
        const sort = req.query.sort;
        //http://localhost:3000/api/anuncios/?sort=precio%20-nombre
        // ordena por precio ascendente y nombre descendente
        
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
                // solo nos pasan un precio, buscaremos solo por precio
                filtro.precio = precio    
            }
        }
        // podremos buscar por varios tags separados por comas
        if (tags) {
            if (tags.includes(',')) {
               vtags = tags.split(',');
               filtro.tags = {$in: vtags};
            } else {
               filtro.tags = {$in: tags};    
            }            
        }

        const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort)
        res.json(resultado);

    } catch (err){
        next(err);
    }
    
});

/**
 * GET /api/anuncios:id (Obtener un anuncio por id)
 */
router.get('/:id', jwtAuth, async (req, res, next)=>{
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

/**
 * POST /api/anuncios (body) crear un anuncio 
 */
router.post('/', jwtAuth, upload.single('foto'), async (req, res, next) => {
    try {
        var foto='';
        const { nombre, venta, precio, tags, createdAt } = req.body;
        if (req.file) {
            foto = req.file.filename;
        }
        //console.log('req.file', req.file);
        //console.log('req.file.filename', req.file.filename);
        //const anuncioData = req.body;

        const anuncio = new Anuncio({nombre, venta, precio, tags, createdAt, foto });   
        // este es un método de instancia
        const anuncioCreado = await anuncio.save (); // lo guarda en base de datos

        await anuncio.crear();

        const requester = new cote.Requester({ name: 'client thumbnail image' });

        if (req.file) {
            const imagen = req.file.originalname;
            const ruta_imagen = path.join(__dirname, '../../public/images/anuncios/')
            const ruta_destino = path.join(__dirname, '../../public/images/anuncios/thumbnails');
            
            console.log('ruta imagen', ruta_imagen);
            console.log('ruta destino', ruta_destino);

            requester.send({
                type: 'do thumbnail image',
                imagen: imagen,
                ruta_imagen: ruta_imagen,
                ruta_destino: ruta_destino
                
            }, async resultado => {
                try {
                   console.log('realizado el thumbnail de la imagen')
                }
                catch (err) {
                    next(err);
                }
           })
    
        }
    
        res.status(201).json({ result: anuncioCreado });
       
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/anuncios:id (body)  
 * Actualizar un anuncio, en el body le pasamos lo que queremos actualizar
 */
router.put('/:id',jwtAuth, async (req, res, next) =>{
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

/**
 * DELETE /api/anuncio: id (Elimina un anuncio dado su id)
 */
router.delete('/:id', jwtAuth, async (req, res, next)=>{
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