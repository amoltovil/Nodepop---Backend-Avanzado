var express = require('express');
var router = express.Router();

/* GET /services */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('services');
});

module.exports = router;
