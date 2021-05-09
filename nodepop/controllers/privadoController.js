'use strict';

class PrivadoController {

  /**
   * GET /privado
   */
   index(req, res, next) {

    // si el usuario no esta logado, le enviamos al login
    // if (!req.session.usuarioLogado) {
    //   res.redirect('/login');
    //   return;
    // }
    // lo quitamos porque se va a acrear un sessionAuthMiddleware para proteger cualquier página

    res.render('privado');
  }

}

module.exports = new PrivadoController();