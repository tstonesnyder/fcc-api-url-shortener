'use strict';

// Express.js:
const express = require('express');
// For communicating with MongoDB:
const mongoose = require('mongoose');
// Our code for handling routes:
const routes = require('./app/routes/index.js');

const app = express();

console.log(`server.js: app.settings.env: ${app.settings.env}`);
if (app.settings.env === 'development') {
  // ONLY NEED THIS IN DEV. On Heroku will store these in config vars (see Settings page).

  /*  USING dotenv: 
      Create a .env file in the root directory of your project. 
      Add environment-specific variables on new lines in the form of NAME=VALUE. 
      config() (alias load()) will read your .env file, parse the contents, 
      assign it to process.env, and return an Object with a parsed key containing the loaded content or an error key if it failed.
  */
  require('dotenv').config();
}
if (!process.env.DB_URI) {
  console.error('ERROR: Missing environment variables!');
  console.dir (process.env);
  process.exit(1);
}
// Use the port that Heroku (now Render) provides or default to 8080 (for Cloud9 or local):
const port = process.env.PORT || 8080;

const dbConnectOptions = {
  // https://mongoosejs.com/docs/deprecations.html
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
mongoose.connect(process.env.DB_URI, dbConnectOptions, function (err) {
  // OTHER WAYS of doing error handling: https://mongoosejs.com/docs/connections.html#error-handling
  if (err) {
    console.error('ERROR: Could not connect to MongoDB at Atlas! You may need to logon to Atlas and RESUME the db (3-5 min).');
    
    throw err;
  }
  console.log('server.js: Connected to MongoDB');
});

routes(app);

app.listen(port, function () {
  console.log('Listening on port ' + port + '. If running locally, go to localhost:' + port);
});

