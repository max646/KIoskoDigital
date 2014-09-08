var express = require('express');
var MP = require('mercadopago');
var passport = require('passport');
var q = require('q');

var MP_CONST = require('../config/mercadopago');

var subscriptions = express.Router();

var mp = new MP(MP_CONST.config.clientId, MP_CONST.config.clientSecret);
mp.sandboxMode(true);

subscriptions.get('/:id', passport.authenticate('basic'), function(req, res) {
  q.when(req.user.findSubscription())
    .then(function(subscription) {
      if (subscription) {
        res.send({
          subscription: {
            id: 1,
            active: true,
          }
        });
        return;
      }

      mp.createPreference({
        items: [
          {
            title: 'subscripción por 3 meses',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: 25
        }],
        external_reference: {
          user: 1, //req.user.id,
          for: req.user.id,
          publisher: 'Barcelona'
        }
      }, function(err, data) {
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
  });

});

module.exports = subscriptions;
