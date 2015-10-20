'use strict';

var express = require('express');
var router = express.Router();
var dMSController = require('../dMSController.js');
console.log()


router.get('/', function(req, res) {
  res.json({
    message: 'Hi! Welcome to the API'
  });
});

// module.exports = {
router.route('/users')
  .post(dMSController.createUser)
  .get(dMSController.getAllUsers)

router.route('/users/login')
  .post(dMSController.login)

router.route('/users/logout')
  .post(dMSController.logout)

router.route('/users/:id')
  .get(dMSController.getUser)
  .put(dMSController.updateUser)
  .delete(dMSController.deleteUser)

router.route('/documents')
  .post(dMSController.createDocument)
  .get(dMSController.getAllDocuments)

router.route('/documents/:id')
  .get(dMSController.getDocument)
  .put(dMSController.updateDocument)
  .delete(dMSController.deleteDocument)

router.route('/users/:id/documents')
  .get(dMSController.getAllDocumentsbyUser)

// app.use('/', router);
module.exports = router;
