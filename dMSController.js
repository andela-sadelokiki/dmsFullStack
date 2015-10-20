'use strict';

var mongoose = require('mongoose');
require('./app/schema/userModel.js');
require('./app/schema/documentModel.js');
var jwt = require('jsonwebtoken');
var db = require('./config/config.js')
var User = mongoose.model('User'),
  Document = mongoose.model('Document');
