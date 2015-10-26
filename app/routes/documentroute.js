'use strict';

var express = require('express');
var router = express.Router();
var UserController = require('../controller/userctrl.server.js');
var DocumentController = require('../controller/documentctrl.server.js');
var userCtrl = new UserController();
var docCtrl = new DocumentController();

module.exports = function(app) {
  router.route('/')
    .post(userCtrl.verifyToken, docCtrl.createDocument)
    .get(docCtrl.getAllDocuments)

  router.route('/:id')
    .get(docCtrl.getDocument)
    .put(docCtrl.updateDocument)
    .delete(docCtrl.deleteDocument)

  app.use('/documents', router)

}
