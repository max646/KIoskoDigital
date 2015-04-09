var mongoose = require('mongoose');
var q = require('q');

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
    payment: Schema.Types.ObjectId, //current payment
    history_of_payments: [Schema.Types.ObjectId], // history of payments,
    plan: Number // subscription plans
});

SubscriptionSchema.methods.findPayment = function() {
    var defer = q.defer();

    Payment.findById(this.payment, function (err, payment) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(payment);
        }
    });

    return defer.promise;
};

SubscriptionSchema.methods.findHistoryOfPayment = function() {
    var defer = q.defer();

    Payment.find({_id: { $in: this.history_of_payments}}, function (err, payments) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(payments);
        }
    });

    return defer.promise;
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