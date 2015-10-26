'use strict';

var express = require('express');
var router = express.Router();
var UserController = require('../controller/userctrl.server');
var userCtrl = new UserController();

module.exports = function(app) {
  router.route('/')
    .post(userCtrl.createUser)
    .get(userCtrl.getAllUsers)

  router.route('/login')
    .post(userCtrl.login)

  router.route('/logout')
    .post(userCtrl.logout)

  router.route('/:id')
    .get(userCtrl.getUser)
    .put(userCtrl.updateUser)
    .delete(userCtrl.deleteUser)

  router.route('/:id/documents')
    .get(userCtrl.getAllDocumentsbyUser)

  app.use('/users', router)
};
