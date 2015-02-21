var mongoose = require('mongoose');
var Subscription = require('./subscriptions').model;

var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    platform: String, // possible values: mercadopago | paypal
    payment_id: String,
    preference_id: String,
    status: String,
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
    return Subscription.findOne({
        _id: this.subscription
    });
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