'use strict';

var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var config = require('./config.js');
var bodyParser = require('body-parser');
mongoose.connect(config.database);

module.exports = function() {
  var app = express();
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
  app.use(express.static('./public/'));
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, Accept, Content-Type, Access-Control-Allow-Headers, x_access_admin, Authorization, X-Requested-With");
    res.header('Access-Control-Allow-Methods', "POST, PUT, DELETE, GET");
    next();
  });

  require('../app/routes/userroute.js')(app);
  require('../app/routes/documentroute.js')(app);
  return app;

}
