'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var router = require('../routes/route.js');
var config = require('./config.js');
var bodyParser = require('body-parser');
mongoose.connect(config.database);
app.set('secret', config.secret);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'tercesnoisses',
  resave: true,
  saveUninitialized: true
}));
app.use('/', router);

exports = module.exports = app;
