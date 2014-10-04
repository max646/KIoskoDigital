var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  owner: Schema.Types.ObjectId,
  publication: Schema.Types.ObjectId,
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = {
  model: mongoose.model('subscription', SubscriptionSchema),
  schema: SubscriptionSchema
};
