'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a new Mongoose schema.
// Each Mongoose schema corresponds to a MongoDB collection. 
// Each key in the schema defines and casts its corresponding property in the MongoDB document.
var Url = new Schema(
  {
    url_nbr: { type: Number, required: true, unique: true },
    url: { type: String, required: true },
    date_created: { type: Date, default: Date.now }
  }
);

// Convert our schema to a Mongoose model, and export the resulting model.
// The model is an object constructor that represents documents within the database.
// args: (singular name of the collection in the db, schema name)
module.exports = mongoose.model('Url', Url);