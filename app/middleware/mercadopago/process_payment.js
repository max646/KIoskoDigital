var q = require('q');
var app = require('../../app');
var mp = app.get('mp');

var MP_CONST = require('../../config/mercadopago');

var Subscription = require('../../models/subscriptions').model;
var Payment = require('../../models/payments').model;

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
                        type: 'regular',
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
                            subscription.history_of_payments.push(payment._id);

                            subscription.save();
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
            if(mp_status != MP_CONST.STATUS.APPROVED && mp_status != MP_CONST.STATUS.AUTHORIZED) {
                status = MP_CONST.STATUS.PENDING;
            } else if(mp_status == MP_CONST.STATUS.APPROVED) {
                status = MP_CONST.STATUS.APPROVED;
            } else if(mp_status == MP_CONST.STATUS.AUTHORIZED) {
                status = MP_CONST.STATUS.AUTHORIZED;
            }
            var duration = parseInt(data.response.external_reference); //if duration == 0 is recurrent payment else total months
            var expired_at = new Date();

            if(duration != 0) {
                expired_at.setMonth(expired_at.getMonth() + duration);
            } else {
                expired_at = data.response.auto_recurring.end_date;
            }

            Payment.findOne({'payment_id': req.body.id}, function(error, payment) {

                if (!payment) {
                    payment = new Payment({
                        payment_id: req.body.id,
                        platform: 'mercadopago',
                        type: 'recurrent',
                        status: mp_status,
                        description: data.response.reason,
                        payer: {
                            id: data.response.payer_id,
                            email: data.response.payer_email
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

module.exports = {
    regular_payment: process_regular_payment,
    recurrent_payment: process_recurrent_payment
};