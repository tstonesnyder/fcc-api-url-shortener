'use strict';

// Express.js:
var express = require('express');
// For communicating with MongoDB:
var mongoose = require('mongoose');
// Our code for handling routes:
var routes = require('./app/routes/index.js');

var app = express();

//require('dotenv').config({path: '/home/ubuntu/private/.env'});

// Use the port that Heroku provides or default to 8080 (for Cloud9):
var port = process.env.PORT || 8080;

var mongoUri = 'mongodb://localhost:27017/urlshortener';

//mongoose.connect(process.env.MONGO_URI);
mongoose.connect(mongoUri);

routes(app);
  
app.listen(port, function () {
  console.log('Listening on port ' + port + '...');
});

