var mp = require('../../app').get('mp');

mp.sandboxMode(true);

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
