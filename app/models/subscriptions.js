var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  owner: Schema.Types.ObjectId,
  from: {
    type: Date,
    default: Date.now
  },
  to: Date
});

module.exports = {
  model: mongoose.model('subscription', SubscriptionSchema),
  schema: SubscriptionSchema
};
