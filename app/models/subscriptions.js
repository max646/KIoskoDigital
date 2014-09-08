var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  owner: Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '90 days'
  },
});

module.exports = {
  model: mongoose.model('subscription', SubscriptionSchema),
  schema: SubscriptionSchema
};
