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
  console.log(params);
  return  {
    "payer_email": params.email,
    "back_url": 'http://revisbarcelona.com:8083',
    "reason": params.description,
    "auto_recurring": {
        "frequency": 1,
        "frequency_type": "months",
        "transaction_amount": params.price,
        "currency_id": "ARS"
    }
  }
};

module.exports = function(req, res) {
  var options = {};
  var payment_id = req.params.id || 0;
  options = subscriptions[payment_id];

  options.email = req.user.username;
  if (payment_id === '0') {
    console.log('preapp!');
    mp.createPreapprovalPayment(create_recurrent_payment(options), function(err, data) {
      console.log(err);
      if (err) {
        res.send({
          error: 'payment error'
        });
      } else {
        console.log(data);
        res.send({
          payment: {
            id: payment_id,
            mp_payment_link: data.response.init_point
          }
        });
      }
    });
  } else {
    console.log('nono');
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
  }
};
