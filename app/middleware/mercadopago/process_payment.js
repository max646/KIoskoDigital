var q = require('q');
var mp = require('../../app').get('mp');
var MP_CONST = require('../../config/mercadopago');
var Subscription = require('../../models/subscriptions').model;
var Payment = require('../../models/payments').model;

var process_payment = function(req, res) {
    if (!req.body.id) res.send({error: 'payment not found.'});

    mp.getPaymentInfo(req.body.id, function(error, data) {

        if (error) {
            res.send(error);
        } else {
            res.send(200);
        }

        var mp_status = data.response.collection.status;
        var status = (mp_status != MP_CONST.STATUS.APPROVED ? MP_CONST.STATUS.PENDING : MP_CONST.STATUS.APPROVED);
        var duration = parseInt(data.response.collection.external_reference); //if duration == 0 is recurrent payment else total months
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
                    platform: 'mercadopago',
                    preference_id: req.body.preference,
                    status: mp_status,
                    description: data.response.collection.reason,
                    payer: {
                        id: data.response.collection.payer.id,
                        email: data.response.collection.payer.email,
                        nickname: data.response.collection.payer.nickname
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
                        subscription.historical_payment.push({
                            payment: payment._id
                        });

                        subscription.save();
                    });

                });
            }

        });
    });
};

module.exports = process_payment;
