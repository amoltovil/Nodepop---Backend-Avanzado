var express = require('express');
const jwtAuth = require('../../lib/jwtAuth');
var router = express.Router();

// cargamos el modelo
const Anuncio = require('../../models/Anuncio');  

/**
 * GET /api/tags (listara los distintos tags de los documentos de anuncios en la base de datos)
 */  

router.get('/', jwtAuth, async function(req, res, next) {
    try {

        const resultado = await Anuncio.listaTags();
        res.json(resultado);

    } catch (err) {
        next(err);
    }
});

module.exports = router;