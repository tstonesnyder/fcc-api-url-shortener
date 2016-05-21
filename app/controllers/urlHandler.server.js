'use strict';

var Urls = require('../models/urls.js');

// Use the revealing module pattern:
function urlHandler () {
  
  // Add a url to the db:
  var addUrl = function (req, res) {
    var appBaseUrl = req.protocol + "://" + req.get('host');
    console.log(`appUrl = ${appBaseUrl}`);

    var url = req.params[0];
    var urlNbr;
    var urlInfoToReturn = {
      original_url: url,
      short_url: ''
    };
    console.log(`addUrl: User request to add URL ${url}`);

    
    Urls
      // CHECK IF THE URL ALREADY EXISTS IN DB:
      .findOne({ 'url': url}, { 'url_nbr': true, '_id': false })
      .exec(function (err, result) {
        if (err) { throw err; }
        
        if (result) {
          // url already exists in db, so just get its urlNbr
          urlInfoToReturn.short_url = appBaseUrl + '/' + result.url_nbr;
          console.log(`addUrl: URL already stored as urlNbr ${result.url_nbr}`);
          return res.json(urlInfoToReturn);
        }
        
        // ADD THIS URL TO THE DB:
        Urls
          // Get the max urlNbr in the db:
          // NOTE: With find().limit(1) an array of the 1 doc is returned.
          .find({}, { 'url_nbr': true, '_id': false })
          .sort({ url_nbr: -1 })
          .limit(1)
          .exec(function (err, result) {
            if (err) { throw err; }
            
            if (!result) {
              // No docs in the db yet, so start w/ 1.
              urlNbr = 1;
            } else {
              // Increment the max nbr by 1
              urlNbr = result[0].url_nbr + 1;
            }

            // Create a new document using our Url model:
            var newDoc = new Urls({
              'url_nbr': urlNbr,
              'url': url
            });
            
            // Insert the new doc to the db
            newDoc.save(function (err, doc) {
              if (err) { throw err; }
              
              urlInfoToReturn.short_url = appBaseUrl + '/' + urlNbr;
              console.log(`addUrl: Added URL to db with short_url = ${urlInfoToReturn.short_url}`);
              return res.json(urlInfoToReturn);
            });
          });
      });
  };

  // Get a url from the db:
  var getUrl = function (req, res) {
    var urlNbr = req.params[0];
    console.log(`getUrl: User request to goto URL nbr ${urlNbr}`);

    Urls
      .findOne({ 'url_nbr': urlNbr}, { 'url': true, '_id': false })
      .exec(function (err, result) {
        if (err) {
          throw err;
        }
        
        if (!result) {
          console.log(`getUrl: No such URL nbr. About to return error json.`);
          return res.json({ 'error': 'Invalid url nbr' });
        }
        
        return res.redirect(result.url);
      });
  };
  
  return {
    addUrl: addUrl,
    getUrl: getUrl
  };
}

// Export the returned object from above:
module.exports = urlHandler();