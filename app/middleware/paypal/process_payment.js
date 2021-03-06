var q = require('q');
var app = require('../../app');
var paypal = app.get('paypal');

var Subscription = require('../../models/subscriptions').model;
var Payment = require('../../models/payments').model;
var RedemptionVoucher = require('../../models/redemption_vouchers').model;

var REDEMPTION_VOUCHER_STATUS = require('../../config/redemption_voucher_status');

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
            var duration = parseInt(paypal_payment.transactions[0].item_list.items[0].sku); //if duration == 1 is recurrent payment else total months
            var expired_at = new Date();

            if(duration != 1) {
                expired_at.setMonth(expired_at.getMonth() + duration);
            } else {
                expired_at.setMonth(expired_at.getMonth() + 1);
            }

            Payment.findOne({'platform.paypal.id': req.body.id}, function(error, payment) {

                if (!payment) {
                    payment = new Payment({
                        platform: {
                            paypal: {
                                id: req.body.id,
                                token: req.body.token,
                                status: status,
                                payer: {
                                    id: req.body.payer,
                                    email: paypal_payment.payer.payer_info.email
                                }
                            }
                        },
                        status: status,
                        description: paypal_payment.transactions[0].description
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

                            RedemptionVoucher
                                .findOne({user: req.user._id, status: REDEMPTION_VOUCHER_STATUS.PENDING})
                                .sort('created_at')
                                .exec(function(err, redemption_voucher) {
                                    if (redemption_voucher) {
                                        redemption_voucher.status = REDEMPTION_VOUCHER_STATUS.COMPLETED;
                                        redemption_voucher.save();
                                    }
                                });
                        });

                    });
                }

            });
        }
    });
};

module.exports = process_payment;
