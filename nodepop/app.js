var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();  // crea la aplicación de express
require('./lib/connectMongoose');  // para conectar a la base de datos

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');  
app.set('view engine', 'html');  
app.engine('html', require('ejs').__express);

app.locals.title ='NodePOP';

//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// middleware de ficheros estáticos
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('/pdf', 'e:\pdfs'))

/**
 * Rutas del API
 */

app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/api/anuncios', require('./routes/api/anuncios'));
app.use('/api/tags', require('./routes/api/tags'));

/**
 * Rutas del Website
 */

app.use('/prueba',function(req, res, next){
  // hay dos opciones
  //res.send('ok'); // una es responder
  //console.log('recibo una petición a', req.originalUrl);
  //next(new Error('la he liado')); 
  next(); // la otra es pasar
});

app.use('/',      require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler: gestor de errores
app.use(function(err, req, res, next) {

  // es un error de validación
  if (err.array) { // validation error
    err.status = 422;
    const errorInfo = err.array({onlyFirstError: true})[0];
    err.message = `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
  }

  res.status(err.status || 500);  // el error que viene o el 500 (error del servidor)

  // Si la petición es al /api devolvemos un json
  if (isAPIRequest(req)){ 
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

// para saber si es una petición del API, buscamos en la url de la petición
function isAPIRequest(req) {
  // busca la primera posición de la cadena '/api/' en la url
  // si no la encuentra devuelve -1
  // devuelve true si se cumple la condición y false sino se cumple
  return req.originalUrl.indexOf('/api/') === 0;
}

module.exports = app;
