/**
 Subscriptions Types by id:
 0 - Recurrent
 3 - 3 months
 6 - 6 months
 **/

var app = require('../../app');
var config = app.get('config');
var mp = app.get('mp');
var paypal = app.get('paypal');

var subscriptions = require('../../config/subscriptions');
var mp_preferences = require('../mercadopago/preferences');
var pp_preferences = require('../paypal/preferences');

module.exports = function(req, res) {

    var init_point = "";
    var payment_id = req.params.id || 0;
    var options = {};

    options = subscriptions[payment_id];
    options.user = req.user;
    options.payment_id = payment_id;

    var payment_response = {
        paymentMethod: {
            id: payment_id,
            mp_payment_link: '',
            pp_payment_link: ''
        }
    };

    if (payment_id === '0') {
        //TODO: createPreapprovalPayment contains a bug.
        //mp.createPreapprovalPayment(mp_preferences.recurrent(options), function(err, data) {
        mp.post("/preapproval", mp_preferences.recurrent(options), function(err, data){

            if (err) {
                res.send(400, {error: 'mp recurrent: payment error'});
            } else {
                if (config.mercadopago.init_point == "sandbox_init_point") {
                    payment_response.paymentMethod.mp_payment_link = data.response.sandbox_init_point;
                } else {
                    payment_response.paymentMethod.mp_payment_link = data.response.init_point;
                }

                // agregar aqui el pago recurrente o mensual de paypal
                res.send(payment_response);
            }
        });

    } else {

        //create mercadopago payment
        mp.createPreference(mp_preferences.regular(options), function(err, data) {

            if (err) {

                res.send(400, {error: 'mp preference: payment error'});

            } else {

                if (config.mercadopago.init_point == "sandbox_init_point") {
                    payment_response.paymentMethod.mp_payment_link = data.response.sandbox_init_point;
                } else {
                    payment_response.paymentMethod.mp_payment_link = data.response.init_point;
                }

                //create paypal payment
                paypal.payment.create(pp_preferences.regular(options), function (error, payment) {

                    if (error) {

                        res.send(400, {error: 'pp regular: payment error'});

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
            }
        });
    }
};
