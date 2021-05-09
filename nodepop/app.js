var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const loginController = require('./controllers/loginController');
const session = require('express-session');
const sessionAuth = require('./lib/sessionAuthMiddleware');
const MongoStore = require('connect-mongo');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();  // crea la aplicación de express

require('./models/connectMongoose'); // para conectar a la base de datos

// Función que podemos usar para llamarla desde las vistas
app.use((req, res, next) => {
  res.locals._ = () => {
    return 'esto es un guion'
  };
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');  
app.set('view engine', 'html');  
app.engine('html', require('ejs').__express);

// Variable global
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
app.post('/api/authenticate', loginController.postJWT);
app.use('/apiv1/anuncios',    require('./routes/apiv1/anuncios'));
app.use('/api/anuncios',      require('./routes/api/anuncios'));
app.use('/api/tags',          require('./routes/api/tags'));

/**
 * Internacionalización (Setup de i18n)
 */
const i18n = require('./lib/i18nConfigure');
app.use(i18n.init);
i18n.__('Welcome to NodePOP');

//i18n.setLocale('es');
//console.log(i18n.__('Welcome to NodePOP'));
app.use((req, res, next) => {
  res.locals._ = () => {
    return 'esto es un guion'
  };
  next();
})

/**
 * Middleware de Gestion de sesiones del website
 * las sesiones se guardan en memoria por defecto 
 * en este caso las almacenamos en MongoDB
 */
 app.use(session({
  name: 'nodepop-session', // nombre de la cookie para poner en la respuesta
  secret: 'dsa987ad9/)H(/G()/9sa7d98',  // para generar los tokens de identificador de session
  saveUninitialized: true,
  resave: false,  // solo lo guarda si se ha modificado, sino lo deja igual
  cookie: {
    //secure: true, // solo se envian al servidor cuando la petición es HTTPS
    secure: process.env.NODE_ENV !== 'development', 
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2 días de inactividad  --> tiempo de expiración de la cookie (en milisegundos)
  },
  store: MongoStore.create({mongoUrl: process.env.MONGODB_CONNECTION_STR})
}));
// app.use((req, res, next) => {
//   // sacar la cookie nodepop-session de la petición
//   // coger el sessionID
//   // buscar en el almacén de sesiones una sesión con sessionID que pone en la cookie
//   // si encuentro la session la pongo en req.session
// })

// hacemos disponible la session en todas las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

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

app.use('/',                require('./routes/index'));
app.use('/services',        require('./routes/services'));
app.use('/docum',           require('./routes/docum'));
//app.use('/users',         require('./routes/users'));
app.use('/change-locale',   require('./routes/change-locale'));


app.get('/login',           loginController.index);
app.post('/login',          loginController.post);
app.get('/logout',          loginController.logout);

/**
 * Rutas del Website (protegidas)
 */

app.get('/privado',         sessionAuth, require('./controllers/privadoController').index);
app.use('/users',           sessionAuth, require('./routes/users'));


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
