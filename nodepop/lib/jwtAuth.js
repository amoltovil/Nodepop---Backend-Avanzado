'use strict';

const jwt = require('jsonwebtoken');

// Exportamos un middleware
module.exports = (req, res, next) => {
  // recoger el jwtToken de la cabecera (o de otros sitios: propiedad de body o querystring)  
    const jwtToken = req.get('Authorization') || req.query.token || req.body.token;

 // comprobar que tengo token
    if (!jwtToken) {
        const error = new Error('No Token Provided');
        error.status = 401;
        next(error);
        return;
    }

 // comprobar que el token es válido
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            err.status = 401;
            next(err);
            return;
        }
        req.apiAuthUserId = payload._id;
        next();
    })
 
};