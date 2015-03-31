var mongoose = require('mongoose');
var q = require('q');

var Subscription = require('./subscriptions').model;

var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    platform: {
        mercadopago: {
            id: String,
            preference_id: String,
            preapproval_id: String,
            status: String,
            payer: {
                id: String,
                email: String,
                nickname: String
            }
        },
        paypal: {
            id: String,
            status: String,
            payer: {
                id: String,
                email: String
            },
            token: String
        }
    },
    status: String, // payment status
    type: String, // recurrent, regular or free
    description: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    discount_amount: {
        type: Number,
        default: 0
    },
    currency: String
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