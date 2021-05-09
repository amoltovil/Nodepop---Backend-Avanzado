'use strict';

const { Usuario } = require('../models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class LoginController {
  
  /**
   * GET /login --> middleware
   */
  index(req, res, next) {
    // inicializa las variables globales de res.locals
    res.locals.email = '';
    res.locals.error = '';
    res.render('login');
  }

  /**
   * POST /login
   */
  async post(req, res, next) {
    try {
      
      const { email, password } = req.body;
      //console.log(email, password);
  
      // buscamos el usuario en la BD
      const usuario = await Usuario.findOne({ email })  // siempre que haya un filtro deberia existir un índice
      //console.log('usuario encontrado:', usuario)
      
      // si no lo encontramos --> error
      // si no coincide la clave --> error
      //if (!usuario || usuario.password !== password) { // no se pueden comparar las contraseñas en claro, han de estar encriptadas
      if (!usuario || !(await usuario.comparePassword(password)) ) {

        res.locals.email = email;  // nos guardamos el email para pasarlo a la vista
        res.locals.error = res.__('Invalid credentials');
        res.render('login');
        return;
      }
  
      // si el usuario existe y la clave coincide
      // apuntamos en la sesion del usuario su _id
      req.session.usuarioLogado = {
        _id: usuario._id
      };

      // podriamos mandar un email al usuario (fn asincrona)
      const info = await usuario.enviarEmail('Este es el asunto', 'Bienvenido a NodePOP');

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      // redirigir a zona privada
      //res.send('privada') --> la url no ha cambiado, sigue en /login
      res.redirect('/privado');
  
    } catch(err) {
      next(err);
    }
  }

  /***
   * POST /api/authenticate 
   * devolverá un JWT (json web token)
   */
   async postJWT(req, res, next) {
    try {
      
      const { email, password } = req.body;
      console.log(email, password);
  
      // buscar el usuario en la BD
      const usuario = await Usuario.findOne({ email })  // siempre que haya un filtro deberia existir un índice
      console.log('usuario encontrado:', usuario)
      
      // si no lo encontramos --> error
      // si no coincide la clave --> error
      
      if (!usuario || !(await usuario.comparePassword(password)) ) {

        const error = new Error('Invalid credentials');
        error.status = 401;
        next(error);
        return;
      }
  
      // si el usuario existe y la clave coincide

      // crear un token JWT (firmado) y devolverselo al cliente
      // DE FORMA asíncrona
      jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '2h' }, (err, jwtToken) => {
        if (err) {
          next(err);
          return;
        }
        // se lo devolvemos al cliente
        res.json({ token: jwtToken });
      });
      
    } catch(err) {
      next(err);
    }
  }

  /***
  * GET /logout, borrar la sesión de la memoria del servidor
  */
  logout(req, res, next) {
    req.session.regenerate(err => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    })
  }

}

// exporta una instancia de la clase del Objeto
module.exports = new LoginController();  

// module.exports = {
//   index: (req, res, next) => {
//     res.render('login');
//   },
//   post: (req, res, next) => {
//   }
// };
