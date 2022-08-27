'use strict';

// This will NOT end in a '/':
var appCWD = process.cwd();
console.log(`appCWD = ${appCWD}`);

// var UrlHandler = require(appCWD + '/app/controllers/urlHandler.server.js');
var urlHandler = require('../controllers/urlHandler.server.js');

module.exports = function (app) {
  // ROOT PATH: send the instructions for using this api:
  app.route('/')
    .get(function (req, res) {
      res.sendFile(appCWD + '/public/instructions.html');
    });
  
  // User it trying to store a new url: /new/:url
  // Accept urls that start with http:// or https://,
  //   and then accept any chars other than space or double quote,
  //   but must contain 1+ char, a period, then 2+ chars.
  //   Capitalization doesn't matter.
  app.route(/^\/new\/(https*:\/\/[^ "]+\.[^ "]{2,})$/i)
    .get(urlHandler.addUrl);
  
  // User is trying to go to a saved site: /:nbrs
  // Must be a series of numeric digits (not starting with zero)
  app.route(/^\/([1-9]+\d*)$/)
    .get(urlHandler.getUrl);
  
  // Trying to create a url with invalid format:
  app.route(['/new', '/new/*'])
    .get(function (req, res) {
      console.log(`Request for invalid path: ${req.path}`);
      res.json({ 'error': 'URL is invalid' });
    });

  // Add a Health Check Path that always returns a 200 OK response (for use by Render):
  app.route('/health')
    .get(function (req, res) {
      console.log(`Request for health check from: ${req.ip}`);
      res.status(200).send('Ok');
    });

  // Trying to go to some other page:
  app.route('*')
    .get(function (req, res) {
      console.log(`Request for invalid path: ${req.path}`);
      res.status(404).sendFile(appCWD + '/public/404.html');
    });
};