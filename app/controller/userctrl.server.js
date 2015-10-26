'use strict';

var mongoose = require('mongoose');
require('../schema/userModel.js');
require('../schema/documentModel.js');
var jwt = require('jsonwebtoken');
var config = require('../../config/config.js');
var User = mongoose.model('User'),
  Document = mongoose.model('Document');
var UserController = function() {};

//Method checks for required fields, checks if user already exists, if not, creates new user
UserController.prototype.createUser = function(req, res, next) {
  if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.username) {
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
      newUser.firstname = req.body.firstname;
      newUser.lastname = req.body.lastname;
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.setPassword(req.body.password);
      newUser.save(function(err, user) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Creation failed'
          });
        }
        res.status(200).json({
          token: user.generateJWT(),
          user: user.username,
          id: user._id,
          success: true,
          message: 'User registered'
        });
      });
    }
  });
};

//Method compares and verifies token sent to the headers
UserController.prototype.verifyToken = function(req, res, next) {
  var token = req.headers["authorization"];
  jwt.verify(token, config.secret, function(err, payload) {
    if (err) {
      res.status(403).json({
        message: 'Enter a valid token'
      });
    } else {
      req.username = payload.username;
      next();
    }
  });
};

//Method returns all created users
UserController.prototype.getAllUsers = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Cannot find all users'
      });
    }
    res.json(users);
  });
};

/*Method checks if for filled required fields, checks if user exists, if user exists,
it generates a token for the user
*/
UserController.prototype.login = function(req, res) {
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
          id: user._id,
          success: true,
          message: 'token Created',
          token: user.generateJWT(),
        });
      } else {
        return res.status(401).json({
          message: 'Enter a valid password'
        });
      }
    } else {
      return res.status(401).json({
        message: 'Username not found'
      });
    }
  });
};

//Method logs out a user by destroying the session
UserController.prototype.logout = function(req, res) {
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
};

//Method finds a user by Id and returns the user object
UserController.prototype.getUser = function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    res.status(200).json(user);
  });
};

//Method finds a user and updates by Id
UserController.prototype.updateUser = function(req, res) {
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
};

//Method finds a user and removes by Id
UserController.prototype.deleteUser = function(req, res) {
  User.remove({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(400).json(err);
    }
    res.status(200).json({
      success: true,
      message: 'User deleted!'
    });
  });
};

//Method gets all documents owned by a user and returns them
UserController.prototype.getAllDocumentsbyUser = function(req, res) {
  Document.find({
      ownerId: req.params.id
    })
    .populate('ownerId')
    .exec(function(err, doc) {
      if (err) {
        return res.json(err);
      }
      return res.json(doc);
    });
};

module.exports = UserController;
