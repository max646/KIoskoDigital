var q = require('q');
var app = require('../../app');
var paypal = app.get('paypal');

var Subscription = require('../../models/subscriptions').model;
var Payment = require('../../models/payments').model;

var process_payment = function(req, res) {
    if (!req.body.id) res.send(400, {error: 'payment not found.'});

    paypal.payment.execute(req.body.id, { "payer_id": req.body.payer }, function (error, paypal_payment) {
        if (error) {

            if(app.get('env') === 'development')
                console.log(error);
            res.send(400, {error: "Has a error occurred processing your payment."});

        } else {

            res.send(200, {status: 'OK'});

            var status = paypal_payment.state;
            var duration = parseInt(paypal_payment.transactions[0].item_list.items[0].sku); //if duration == 0 is recurrent payment else total months
            var expired_at = new Date();

            if(duration != 0) {
                expired_at.setMonth(expired_at.getMonth() + duration);
            } else {
                expired_at.setMonth(expired_at.getMonth() + 1);
            }

            Payment.findOne({'payment_id': req.body.id}, function(error, payment) {

                if (!payment) {
                    payment = new Payment({
                        payment_id: req.body.id,
                        platform: 'paypal',
                        token: req.body.token,
                        status: status,
                        description: paypal_payment.transactions[0].description,
                        payer: {
                            id: req.body.payer,
                            email: paypal_payment.payer.payer_info.email
                        }
                    });

                    payment.save(function(error, payment){

                        q.when(req.user.findSubscription()).then(function(subscription) {

                            if(!subscription) {
                                subscription = new Subscription({
                                    owner: req.user._id
                                });
                            }

                            subscription.status = status;
                            subscription.active = true;
                            subscription.modified_at = Date.now();
                            subscription.expired_at = expired_at;
                            subscription.duration = duration;
                            subscription.payment = payment._id;
                            subscription.history_of_payments.push(payment._id);

                            subscription.save();
                        });

                    });
                }

            });
        }
    });
};

module.exports = process_payment;
