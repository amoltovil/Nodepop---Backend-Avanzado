var express = require('express');
var router = express.Router();

const {query, param, body, validationResult} = require('express-validator'); // destructuring
const { Validator, ValidationError } = require('express-json-validator-middleware');
const Anuncio = require('../models/Anuncio');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.locals.tipoanuncios ='Anuncios Ventas / Anuncios Búsqueda';
  
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
    //http://localhost:3000/api/anuncios/?fields=precio%20name%20-_id
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
                    filterPrices ={ $gte: parseFloat(precios[0]), $lte: parseFloat(precios[1]) }
                } else if (isNaN(parseFloat(precios[0])) && !isNaN(parseFloat(precios[1]))) {
                    // buscará los anuncios que sean menores a este precio    
                    filterPrices ={ $lte: parseFloat(precios[1]) }
                } else if (!isNaN(parseFloat(precios[0])) && isNaN(parseFloat(precios[1]))) {
                    // buscara los anuncios de precio mayor a este
                    filterPrices ={ $gte: parseFloat(precios[0]) }
                }
        
                filtro.precio = filterPrices
            } 

        } else {
            // solo nos pasan un precio, buscaremos solo por este
            filtro.precio = precio
        }
    }
  
   if (tags) {
      filtro.tags = {$in: tags};
    }
 
    // const resultado = await Anuncio.find({});
    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort)//await Anuncio.lista({ name : name});
    res.render('index', {resultado} );

  } catch (err){
    next(err);
  }
});

// middleware que atiende peticiones GET /parametroenruta/*
router.get('/parametroenruta/:dato', (req, res, next)=>{
  const dato = req.params.dato;
  console.log(req.params);
  res.send('He recibido el dato:' + dato);
});

router.get('/parametrofiltrado/:dato([0-9]+)', (req, res, next) =>{
  const dato = req.params.dato;
  console.log(req.params);
  res.send('He recibido el dato:' + dato);
});

router.get('/parametroopcional/:dato?', (req, res, next) =>{
  const dato = req.params.dato;
  console.log(req.params);
  res.send('He recibido el dato:' + dato);
});

//http://localhost:3000/parametros/55/piso/4/puerta/8%C2%AA
// Con validadción del parámetro piso
//http://localhost:3000/parametros/55/piso/segundo/puerta/8
router.get('/parametros/:dato/piso/:piso/puerta/:puerta', [
  param('piso').isNumeric().withMessage('must be numeric')
], (req, res, next) =>{
  validationResult(req).throw();

  const dato = req.params.dato;
  console.log(req.params);
  res.send('He recibido el dato:' + dato);
});

// Validado, podemos poner tantas validaciones como queramos metidas en un array
//http://localhost:3000/querystring?dato=20&?talla=42
router.get('/querystring', [ // validaciones
   query('dato').isNumeric().withMessage('must be numeric'), 
   query('talla').isAlpha().withMessage('must be literal'),
   query('talla').custom(talla =>{
     if (talla !=='L' && talla !== 'M') return false;
     return true; 
   }).withMessage('must be L or M')
  ], (req, res, next)=>{
    validationResult(req).throw(); // excepción si hay errores de validación

  const dato = req.query.dato;
  console.log(req.query);
  res.send('He recibido el dato:' + dato);

});

router.post('/enelbody', (req,res, next)=>{
  console.log(req.body);
  console.log('Cabecera', req.get('Content-type'));
  res.send('He recibido el dato:' + req.body.numero);
});

router.post('/redireccion', (req, res, next) => {
  res.redirect(302,'/users/5');  // redirecciono a está ruta, el status 301 es una redireccion permanente
});

module.exports = router;
