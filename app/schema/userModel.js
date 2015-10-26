'use strict';

var mongoose = require("mongoose"),
  config = require('../../config/config.js'),
  jwt = require('jsonwebtoken'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

var userSchema = new Schema({
  username: {
    type: String,
    required: 'Please enter username',
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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
};
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  console.log(config.secret, "secret")
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  var token = jwt.sign({
    username: this.username,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, config.secret);
  return token;
};

mongoose.model('User', userSchema);
