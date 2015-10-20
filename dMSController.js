'use strict';

var mongoose = require('mongoose');
require('./app/schema/userModel.js');
require('./app/schema/documentModel.js');
var jwt = require('jsonwebtoken');
var db = require('./config/config.js')
var User = mongoose.model('User'),
  Document = mongoose.model('Document');


module.exports = {

  //Method checks for required fields, checks if user already exists, if not, creates new user
  createUser: function(req, res, next) {
    if (!req.body.name.first || !req.body.name.last || !req.body.email || !req.body.password || !req.body.username) {
      res.status(401).json({
        success: false,
        message: 'Please fill required fields'
      });
    }
    User.findOne({
      username: req.body.password
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.status(400).json({
          message: 'User already exists, login'
        });
      } else {
        var newUser = new User();
        newUser.name.first = req.body.name.first;
        newUser.name.last = req.body.name.last;
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.setPassword(req.body.password);
        newUser.save(function(err, user) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Creation failed'
            });
          } else {
            res.status(200).json({
              token: user.generateJWT(),
              user: user.username,
              success: true,
              message: 'User registered'
            });
          }
        });
      }
    });
  },

  //Method returns all created users
  getAllUsers: function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Cannot find all users'
        });
      }
      res.json(users);
    });
  },

  /*Method checks if for filled required fields, checks if user exists, if user exists,
  it generates a token for the user
  */
  login: function(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: 'Please fill out all fields; username and password'
      });
    }
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) {
        res.status(400).json(err);
      }
      if (user) {
        if (user.validPassword(req.body.password)) {
          return res.status(200).json({
            userId: user._id,
            success: true,
            message: 'token Created',
            token: user.generateJWT(),
          });
        } else {
          return res.status(401).json({
            message: 'Enter a valid password'
          })
        }
      } else {
        return res.status(401).json({
          message: 'Username not found'
        })
      }
    });
  },

  //Method logs out a user by destroying the session
  logout: function(req, res) {
    req.session.destroy(function(err, success) {
      if (err) {
        res.status(500).json({
          message: 'Unable to logout due to server error'
        });
      }
      res.status(200).json({
        success: true,
        message: 'You are successfully logged out'
      });
    });
  },

  //Method finds a user by Id and returns the user object
  getUser: function(req, res) {
    User.findOne({
      _id: req.params.id
    }, function(err, user) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(user);
    });
  },

  //Method finds a user and updates by Id
  updateUser: function(req, res) {
    User.update({
      _id: req.params.id
    }, req.body, function(err, user) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Update failed'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'User updated!'
      });
    });
  },

  //Method finds a user and removes by Id
  deleteUser: function(req, res) {
    User.remove({
      _id: req.params.id
    }, function(err, user) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(user);
    });
  },

  /*Method creates a user, save the user id as the owner id
  of the document to be created, then saves the docuent
  */
  createDocument: function(req, res) {
    var userId;
    User.findOne({
      username: req.body.name
    }, function(err, user) {
      if (err) {
        console.log('err1', err);
      } else if (!user) {
        console.log('found user', user);
        return res.status(400).json({
          message: 'You need to be registered to create a document'
        });
      } else {
        console.log('user cerated', user._id);
        userId = user._id
        var newDoc = new Document({
          title: req.body.title,
          ownerId: userId
        });
        newDoc.save(function(err, doc) {
          if (err) {
            console.log('err in saving', err);
            return err;
          } else {
            return res.status(200).send(doc);
          }
        });
      }
    });
  },

  //Method returns all created documents
  getAllDocuments: function(req, res) {
    Document.find({}, function(err, docs) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Cannot find all documents'
        });
      }
      res.status(200).send(docs);
    });
  },

  //Method finds a document by Id and returns it
  getDocument: function(req, res) {
    Document.findOne({
      _id: req.params.id
    }, function(err, doc) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).send(doc);
    });
  },

  //Method finds a document by Id and updates it
  updateDocument: function(req, res) {
    Document.update({
      _id: req.params.id
    }, req.body, function(err, doc) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Update failed'
        });
      }
      return res.status(200).send(doc);
    });
  },

  //Method finds a document by Id and deletes it
  deleteDocument: function(req, res) {
    Document.findById(req.params.id)
      .remove(function(err, doc) {
        if (err) {
          return res.send(err);
        }
        console.log('doc removed');
        res.json({
          message: 'Document successfully removed'
        });
      });
  },

  //Method gets all documents owned by a user and returns them
  getAllDocumentsbyUser: function(req, res) {
    Document.find({
        'ownerId': req.params.id
      })
      .populate('ownerId')
      .exec(function(err, doc) {
        if (err) {
          return res.json(err);
        }
        return res.json(doc);
      });
  }
};
