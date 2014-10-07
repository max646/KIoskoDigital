/**
  Subscriptions Types by id:
    0 - Recurrent
    3 - 3 months
    6 - 6 months
**/

var mp = require('../../app').get('mp');
var subscriptions = require('../../config/subscriptions');

// params.id
// params.email
// params.picture
// params.description
// params.price
var create_mp_preference = function(params) {
  return {
    "items": [{
		 "id": params.id,
		 "title": params.title,
		 "currency_id": "ARS",
		 "picture_url": params.picture_url,
		 "description": params.description,
		 "quantity": 1,
	   "unit_price": params.price
	 }],
	 "payer": {
		"email": params.email,
	 },
  }
}

var create_recurrent_payment = function(params) {

}

module.exports = function(req, res) {
  var options = {};
  var payment_id = req.params.id || 0;
  options = subscriptions[payment_id];

  options.email = req.user.username;

  mp.createPreference(create_mp_preference(options), function(err, data) {
    console.log(data.response.items[0]);
    if (err) {
      res.send(400, {
        error: 'Error in payment'
      });
    } else {
      res.send({
        payment: {
          id: payment_id,
          mp_payment_link: data.response.init_point
        }
      });
    }
  });
};


/*
module.exports = function(req, res) {
  var preference = {
    "payer_email" : 'tehsis@hotmail.com', // req.user.username,
      "back_url" : "http://revisbarcelona.com",
      "reason" : "Suscripción mensual a Revista Barcelona",
      "external_reference": "OP-1234",
      "auto_recurring": {
        "frequency": 1,
        "frequency_type": "months",
        "transaction_amount": 25,
        "currency_id": "ARS",
        "start_date": Date.now,
        "end_date": "2014-12-10T14:58:11.778-03:00"
      }
  };

  mp.createPreapprovalPayment(preference, function(err, data) {
    if (err) {
      res.send({
        error: 'payment error'
      });
    } else {
      res.send({
        subscription: {
          id: 1,
          active: false,
          mp_payment_link: data.response.sandbox_init_point
        }
      });
    }
  });
};
*/
