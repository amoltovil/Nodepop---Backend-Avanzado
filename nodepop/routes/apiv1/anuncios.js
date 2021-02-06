var express = require('express');
var router = express.Router();

// cargamos el modelo
const Anuncio = require('../../models/Anuncio');  

/* GET /apiv1/anuncios */
// 1ª versión de listar anuncios
//http://localhost:3000/apiv1/anuncios
router.get('/', async function(req, res, next) {
    // CON ASYNC AWAIT
    try {
    
        const resultado = await Anuncio.find();
        res.json(resultado);

    } catch (err){
        next(err);
    }
    
});

module.exports = router;