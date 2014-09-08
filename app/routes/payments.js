var express = require('express');
var MP = require('mercadopago');
var MP_CONST = require('../config/mercadopago');
var app = require('../app');

var io = app.get('io');

var mp = new MP(MP_CONST.config.clientId, MP_CONST.config.clientSecret);
mp.sandboxMode(true);

var payments = express.Router();
var sockets = {};

io.on('connection', function(socket) {
  socket.on('waiting', function(data) {
    sockets[1] = socket;
  });
});

payments.post('/mp-process', function(req, res) {
  mp.getPaymentInfo(req.body.id, function(error, data) {
    var status = data.response.collection.status;
    var user = data.response.collection.external_reference.user;
    console.log(user);
    if (error) {
      res.send(error);
    } else {
      res.send(200);
    }

    if (status === MP_CONST.STATUS.APPROVED) {
      Subscription.create({
        owner: data.external_reference.owner
      });
      // Notificar al usuario
    } else if (status === MP_CONST.STATUS.PENDING) {
      // Notificar al usuario
      if (sockets[user]) {
        sockets[user].emit('payment-status', {
          status: 'approved'
        })
      }
    } else {
      // notificar error?
      console.log(data);
    }
  });
});

module.exports = payments;
