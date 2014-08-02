var mongoose = require('mongoose');
var PublisherSchema = require('./publishers').schema;

var Schema = mongoose.Schema;

var PublicationSchema = new Schema({
  name: String,
  publisher: Schema.Types.ObjectId
});

module.exports = {
  model: mongoose.model('publication', PublicationSchema),
  schema: PublicationSchema
};
