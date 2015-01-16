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

var SubscriptionModel = null;

try {
  SubscriptionModel = mongoose.model('subscription')
} catch (err) {
  SubscriptionModel = mongoose.model('subscription', SubscriptionSchema)
}

module.exports = {
  model: SubscriptionModel,
  schema: SubscriptionSchema
};