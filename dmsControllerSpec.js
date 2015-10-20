'use strict';
var app = require('./server.js');
var mongoose = require('mongoose');
var request = require('supertest')(app);
var User = mongoose.model('User'),
  Document = mongoose.model('Document');

describe('User Routes', function() {

  it('should test POST method for /users/login', function(done) {

  });

  it('should test POST method for logout', function(done) {

  });

  it('should test GET method for /users', function(done) {

  });

  it('should test GET method for /users/:id', function(done) {

  });

  it('should test PUT method for /users/:id', function(done) {

  });

  it('should test DELETE method for /users/:id', function(done) {

  });

});

describe('Document Routes', function() {


  it('should test GET method for /documents', function(done) {

  });

  it('should test GET method for /documents/:id', function(done) {

  });

  it('should test GET method for /users/:id/documents', function(done) {

  });


  it('should test PUT method for /documents/:id', function(done) {

  });

  it('should test DELETE method for /documents/:id', function(done) {

  });

});

describe('POST /users', function() {

  it('should test POST method for /users', function(done) {

  });

});

describe('POST /documents', function() {

  it('should test POST method for /documents', function(done) {

  });

});
