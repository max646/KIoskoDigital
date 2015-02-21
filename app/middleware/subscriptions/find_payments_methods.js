/**
 Subscriptions Types by id:
 0 - Recurrent
 3 - 3 months
 6 - 6 months
 **/

var app = require('../../app');
var config = app.get('config');
var mp = app.get('mp');
var subscriptions = require('../../config/subscriptions');
var mp_preferences = require('../mercadopago/preferences');

var create_mp_preference = mp_preferences.regular;
var create_recurrent_payment = mp_preferences.recurrent;

module.exports = function(req, res) {
    var options = {};
    var init_point = "";
    var payment_id = req.params.id || 0;
    options = subscriptions[payment_id];
    options.user = req.user;
    options.payment_id = payment_id;

    if (payment_id === '0') {
        //console.log('preapp!');
        mp.createPreapprovalPayment(create_recurrent_payment(options), function(err, data) {
            //console.log(err);
            //console.log(data);
            if (err) {
                res.send({
                    error: 'payment error'
                });
            } else {
                if (config.mercadopago.init_point == "sandbox_init_point") {
                    init_point = data.response.sandbox_init_point;
                } else {
                    init_point = data.response.init_point;
                }
                res.send({
                    payment: {
                        id: payment_id,
                        mp_payment_link: init_point
                    }
                });
            }
        });
    } else {
        mp.createPreference(create_mp_preference(options), function(err, data) {
            //console.log(err);
            //console.log(data);
            if (err) {
                res.send(400, {
                    error: 'Error in payment'
                });
            } else {
                if (config.mercadopago.init_point == "sandbox_init_point") {
                    init_point = data.response.sandbox_init_point;
                } else {
                    init_point = data.response.init_point;
                }
                res.send({
                    payment: {
                        id: payment_id,
                        mp_payment_link: init_point
                    }
                });
            }
        });
    }
};
