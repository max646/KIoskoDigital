var mongoose = require('mongoose');
var q = require('q');

var Subscription = require('./subscriptions').model;

var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    platform: String, // mercadopago or paypal
    payment_id: String, // payment id -> platform -> mercadopago or paypal
    preference_id: String, // preference id -> mercadopago
    token: String, // token -> paypal
    status: String, // payment status
    type: String, // recurrent or regular
    description: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    payer: {
        id: String,
        email: String,
        nickname: String
    }
});

PaymentSchema.methods.findSubscription = function() {
    var defer = q.defer();

    Subscription.findOne({
        payment: this._id
    }).exec(function (err, subscription) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(subscription);
        }
    });

    return defer.promise;
};

var PaymentModel = null;

try {
    PaymentModel = mongoose.model('payment')
} catch (err) {
    PaymentModel = mongoose.model('payment', PaymentSchema)
}

module.exports = {
    model: PaymentModel,
    schema: PaymentSchema
};