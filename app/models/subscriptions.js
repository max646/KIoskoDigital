var mongoose = require('mongoose');
var Payment = require('./payments').model;

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
    owner: Schema.Types.ObjectId,
    publication: Schema.Types.ObjectId,
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    modified_at: Date,
    expired_at: Date,
    duration: Number,
    status: String,
    payment: Schema.Types.ObjectId,
    historical_payment: [{
        payment: Schema.Types.ObjectId,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

SubscriptionSchema.methods.findPayments = function() {
    Payment.find({
        subscription: this._id
    }).sort({ payed_on : 'desc'}).exec(function (error, payments) {
        if (error) return error;
        return payments;
    });
};

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