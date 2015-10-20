'use strict';

var mongoose = require("mongoose"),
  db = require('../../config/config.js'),
  jwt = require('jsonwebtoken'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

var userSchema = new Schema({
  username: {
    type: String,
    required: 'Please enter username'
  },
  name: {
    first: {
      type: String,
      required: true,
      index: {
        unique: true
      },
      unique: true
    },
    last: {
      type: String,
      required: true,
      index: {
        unique: true
      },
      unique: true
    }
  },
  email: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: 'Provide password'
  },
  hash: {
    type: String,
    required: 'Provide password'
  }
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  this.hash;
};
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  var token = jwt.sign({
    _id: this._id,
    name: this.name,
    emailAddress: this.emailAddress,
    exp: parseInt(exp.getTime() / 1000),
  }, db.secret);
  this.token = token;
  return token;
};



mongoose.model('User', userSchema);
