var mongoose = require('mongoose');
var PublisherSchema = require('./publishers').schema;
var Issue = require('./issues').model;

var Schema = mongoose.Schema;

var PublicationSchema = new Schema({
  name: String,
  publisher: Schema.Types.ObjectId
});

PublicationSchema.methods.findIssues = function _findIssues() {
  return Issue.find({
    publication: this._id
  });
};

PublicationSchema.methods.findSubscriptions = function _findSubscriptions() {
  return Subscription.find({
    publication: this._id
  });
};

module.exports = {
  model: mongoose.model('publication', PublicationSchema),
  schema: PublicationSchema
};
