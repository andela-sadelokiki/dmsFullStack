'use strict';

var db = require('./config/config.js');
var app = require('./config/express.js');
var port = process.env.PORT || 3030;
app.listen(port);
console.log('App up and running on port:' + port);

module.exports = app;
