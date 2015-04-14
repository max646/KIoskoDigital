/**
 Subscriptions Types by id:
 1 - Recurrent (monthly)
 3 - 3 months
 6 - 6 months
 12 - 12 months
 **/

var app = require('../../app');
var config = app.get('config');
var mp = app.get('mp');
var paypal = app.get('paypal');

var SUBSCRIPTION_PLANS = require('../../config/subscription_plans');

var mp_preferences = require('../mercadopago/preferences');
var pp_preferences = require('../paypal/preferences');

module.exports = function(req, res) {

    var init_point = "";
    var payment_id = req.params.id || 0;
    var options = {};

    options = SUBSCRIPTION_PLANS[payment_id];
    options.user = req.user;
    options.payment_id = payment_id;

    var payment_response = {
        paymentMethod: {
            id: payment_id,
            mp_payment_link: '',
            pp_payment_link: ''
        }
    };

    if (payment_id === '1') {
        //TODO: createPreapprovalPayment contains a bug.
        //mp.createPreapprovalPayment(mp_preferences.recurrent(options), function(err, data) {
        mp_preferences.recurrent(options).then(function (mercadopago_preference) {

            mp.post("/preapproval", mercadopago_preference, function(err, data){

                if (err) {
                    res.send(400, {error: 'mp recurrent: payment error'});
                    console.log(mercadopago_preference);
                    console.log(err);
                } else {
                    if (config.mercadopago.init_point == "sandbox") {
                        payment_response.paymentMethod.mp_payment_link = data.response.sandbox_init_point;
                    } else {
                        payment_response.paymentMethod.mp_payment_link = data.response.init_point;
                    }

                    // agregar aqui el pago recurrente o mensual de paypal
                    res.send(payment_response);
                }
            });
        })
        .fail(function(err){
            res.send(400, err);
            console.log(err);
        });

    } else {

        mp_preferences.regular(options).then(function(mercadopago_preference){

            //create mercadopago payment
            mp.createPreference(mercadopago_preference, function(err, data) {

                if (err) {

                    res.send(400, {error: 'mp preference: payment error'});
                    console.log(mercadopago_preference);
                    console.log(err);

                } else {

                    if (config.mercadopago.init_point == "sandbox") {
                        payment_response.paymentMethod.mp_payment_link = data.response.sandbox_init_point;
                    } else {
                        payment_response.paymentMethod.mp_payment_link = data.response.init_point;
                    }

                    pp_preferences.regular(options).then(function(paypal_preference){

                        //create paypal payment
                        paypal.payment.create(paypal_preference, function (error, payment) {

                            if (error) {

                                res.send(400, {error: 'pp regular: payment error'});
                                console.log(paypal_preference);
                                console.log(err);

                            } else {

                                if(payment.payer.payment_method === 'paypal') {

                                    for(var i=0; i < payment.links.length; i++) {
                                        var link = payment.links[i];
                                        if (link.method === 'REDIRECT') {
                                            payment_response.paymentMethod.pp_payment_link = link.href;
                                        }
                                    }

                                    res.send(payment_response);
                                }
                            }
                        });
                    })
                    .fail(function(err){
                        res.send(400, err);
                        console.log(err);
                    });
                }
            });
        })
        .fail(function(err){
            res.send(400, err);
            console.log(err);
        });
    }
};
