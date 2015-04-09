var q = require('q');
var app = require('../../app');
var mp = app.get('mp');

var MERCADOPAGO = require('../../config/mercadopago');
var PAYMENT_TYPES = require('../../config/payment_types');

var Subscription = require('../../models/subscriptions').model;
var Payment = require('../../models/payments').model;
var RedemptionVoucher = require('../../models/redemption_vouchers').model;

var REDEMPTION_VOUCHER_STATUS = require('../../config/redemption_voucher_status');

var process_regular_payment = function(req, res) {

    if (!req.body.id) res.send(400, {error: 'payment not found.'});

    mp.getPaymentInfo(req.body.id, function(error, data) {

        if (error) {

            if(app.get('env') === 'development')
                console.log(error);
            res.send(400, {error:"Has a error occurred processing your payment."});

        } else {

            res.send(200, {status: 'OK'});

            var mp_status = data.response.collection.status;
            var status = (mp_status != MERCADOPAGO.STATUS.APPROVED ? MERCADOPAGO.STATUS.PENDING : MERCADOPAGO.STATUS.APPROVED);
            var duration = parseInt(data.response.collection.external_reference); //if duration == 1 is recurrent payment else total months
            var expired_at = new Date();

            if(duration != 1) {
                expired_at.setMonth(expired_at.getMonth() + duration);
            } else {
                expired_at.setMonth(expired_at.getMonth() + 1);
            }

            Payment.findOne({'platform.mercadopago.id': req.body.id}, function(error, payment) {

                if (!payment) {
                    payment = new Payment({
                        platform: {
                            mercadopago: {
                                id: req.body.id,
                                preference_id: req.body.preference,
                                payer: {
                                    id: data.response.collection.payer.id,
                                    email: data.response.collection.payer.email,
                                    nickname: data.response.collection.payer.nickname
                                },
                                status: mp_status
                            }
                        },
                        type: PAYMENT_TYPES.REGULAR,
                        status: mp_status,
                        description: data.response.collection.reason
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
                                    if(redemption_voucher) {
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

var process_recurrent_payment = function(req, res) {

    if (!req.body.id) res.send(400, {error: 'payment not found.'});

    mp.getPreapprovalPayment(req.body.id, function(error, data) {

        if (error) {

            if(app.get('env') === 'development')
                console.log(error);
            res.send(400, {error:"Has a error occurred processing your payment."});

        } else {

            res.send(200, {status: 'OK'});

            var mp_status = data.response.status;
            var status = '';
            if(mp_status != MERCADOPAGO.STATUS.APPROVED && mp_status != MERCADOPAGO.STATUS.AUTHORIZED) {
                status = MERCADOPAGO.STATUS.PENDING;
            } else if(mp_status == MERCADOPAGO.STATUS.APPROVED) {
                status = MERCADOPAGO.STATUS.APPROVED;
            } else if(mp_status == MERCADOPAGO.STATUS.AUTHORIZED) {
                status = MERCADOPAGO.STATUS.AUTHORIZED;
            }
            var duration = parseInt(data.response.external_reference); //if duration == 0 is recurrent payment else total months
            var expired_at = new Date();

            if(duration != 0) {
                expired_at.setMonth(expired_at.getMonth() + duration);
            } else {
                expired_at = data.response.auto_recurring.end_date;
            }

            Payment.findOne({'platform.mercadopago.id': req.body.id}, function(error, payment) {

                if (!payment) {
                    payment = new Payment({
                        platform: {
                            mercadopago: {
                                id: req.body.id,
                                preapproval_id: req.body.id,
                                payer: {
                                    id: data.response.payer_id,
                                    email: data.response.payer_email
                                },
                                status: mp_status
                            }
                        },
                        type: PAYMENT_TYPES.RECURRENT,
                        status: mp_status,
                        description: data.response.reason
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
                                    redemption_voucher.status = REDEMPTION_VOUCHER_STATUS.COMPLETED;
                                    redemption_voucher.save();
                                });
                        });

                    });
                }

            });
        }

    });
};

module.exports = {
    regular_payment: process_regular_payment,
    recurrent_payment: process_recurrent_payment
};