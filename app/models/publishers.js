var mongoose = require('mongoose');
var Publications = require('./publications');

var Schema = mongoose.Schema;

var PublisherSchema = new Schema({
  name: String,
  publications: [Schema.Types.ObjectId]
});

module.exports = {
  model: mongoose.model('publisher', PublisherSchema),
  schema: PublisherSchema
};
