 'use strict';

 var mongoose = require('mongoose');
 require('../schema/userModel.js');
 require('../schema/documentModel.js');
 var jwt = require('jsonwebtoken');
 var config = require('../../config/config.js');
 var User = mongoose.model('User'),
   Document = mongoose.model('Document');
 var DocumentController = function() {};

 /*Method creates a user, save the user id as the owner id
  of the document to be created, then saves the docuent
  */
 DocumentController.prototype.createDocument = function(req, res) {
   var day = new Date();
   var currentDate = day.getDate() + '-' + day.getMonth() + '-' + day.getFullYear();
   var userId;
   User.findOne({
     username: req.username
   }, function(err, user) {
     if (err) {} else if (!user) {
       return res.status(400).json({
         message: 'You need to be registered to create a document'
       });
     } else {
       userId = user._id;
       var newDoc = new Document({
         title: req.body.title,
         content: req.body.content,
         ownerId: userId,
         dateCreated: currentDate
       });
       newDoc.save(function(err, doc) {
         if (err) {
           return err;
         } else {
           return res.status(200).send(doc);
         }
       });
     }
   });
 };

 //Method returns all created documents
 DocumentController.prototype.getAllDocuments = function(req, res) {
   Document.find({}, function(err, docs) {
     if (err) {
       res.status(400).json({
         success: false,
         message: 'Cannot find all documents'
       });
     }
     res.status(200).send(docs);
   });
 };

 //Method finds a document by Id and returns it
 DocumentController.prototype.getDocument = function(req, res) {
   Document.findOne({
     _id: req.params.id
   }, function(err, doc) {
     if (err) {
       return res.status(400).json(err);
     }
     res.status(200).send(doc);
   });
 };

 //Method finds a document by Id and updates it
 DocumentController.prototype.updateDocument = function(req, res) {
   var doc_id = req.params.id;
   Document.update({
       _id: doc_id
     }, {
       title: req.body.title,
       content: req.body.content,
     },
     function(err, doc) {
       if (err) {
         return res.status(400).json(err);
       }
       return res.status(200).json(doc);
     });
 };

 //Method finds a document by Id and deletes it
 DocumentController.prototype.deleteDocument = function(req, res) {
   Document.findById(req.params.id)
     .remove(function(err, doc) {
       if (err) {
         return res.send(err);
       }
       res.json({
         message: 'Document successfully removed'
       });
     });
 };

 module.exports = DocumentController;
