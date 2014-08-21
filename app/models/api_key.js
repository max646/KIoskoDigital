var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Api_keySchema = new Schema({
  access_token: String,
  expired_at: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  model: mongoose.model('subscription', Api_keySchema),
  schema: Api_keySchema
};
