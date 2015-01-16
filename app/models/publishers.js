var mongoose = require('mongoose');
var Publications = require('./publications');

var Schema = mongoose.Schema;

var PublisherSchema = new Schema({
  name: String,
  publications: [Schema.Types.ObjectId]
});

var PublisherModel = null;

try {
  PublisherModel = mongoose.model('publisher')
} catch (err) {
  PublisherModel = mongoose.model('publisher', PublisherSchema)
}

module.exports = {
  model: PublisherModel,
  schema: PublisherSchema
};