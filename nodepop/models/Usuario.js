'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const emailTransportConfigure = require('../lib/emailTransportConfigure')

const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },  // índice único(restringe duplicados)
  password: String
});

/***
 * Método statico del Usuario (es como un método de la clase o modelo)
 * 7 es el nº de saltrounds, la fn devuelve una promesa
 */
usuarioSchema.statics.hashPassword = function(passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);  
}

/***
 * Método de instancia, se utiliza sobre un usuario en concreto
 * para no perder el this, la fn no puede ser una arrow function
 */
usuarioSchema.methods.comparePassword = function(passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
}

/***
 * Método de instancia 
 */
usuarioSchema.methods.enviarEmail = async function (asunto, cuerpo) {
  // crea un transport dependiendo de la variable de entorno NODE_ENV
 
  const transport = await emailTransportConfigure();

  // envia el correo que devuelve una promesa
  return transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to: this.email,
    subject: asunto,
    html: cuerpo
  });

};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
