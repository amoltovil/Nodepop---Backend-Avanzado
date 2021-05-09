var express = require('express');
var router = express.Router();

/* GET /change-locale/:locale */
router.get('/:locale', function(req, res, next) {
  
  const locale = req.params.locale;
  
  // poner una cookie con el idioma que me piden
  // maxAge : 20 dias (1000 ms * 60 seg *60 min * 24 horas * 20 dias)
  res.cookie('nodepop-locale', locale, { maxAge: 1000 * 60 * 60 * 24 * 20 }); 
  
  // redirigir a la página de donde venía (cabecera referer)
  // pero en el idioma seleccionado, lo cogemos de la petición
  res.redirect(req.get('referer'));
});

module.exports = router;