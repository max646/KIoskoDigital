var mp = require('../../app').get('mp');
var MP_CONST = require('../../config/mercadopago');
var Subscription = require('../../models/subscriptions').model;

var io = require('../../app').get('io');

var sockets = {};

io.on('connection', function(socket) {
  socket.on('waiting', function(data) {
    sockets[data.id] = socket;
  });
});

var process_payment = function(req, res) {
  if (!req.body.id) return;
  mp.getPaymentInfo(req.body.id, function(error, data) {
    var mp_status = data.response.collection.status;
    var user = data.response.collection.external_reference.user;
    if (error) {
      res.send(error);
    } else {
      res.send(200);
    }

    var status;
    if (MP_CONST.STATUS.AUTHORIZED === mp_status) {
      Subscription.create({
        owner: data.external_reference.owner
      });
      status = 'approved';
    } else if (MP_CONST.STATUS.PENDING === mp_status) {
      status = 'pending';
    } else {
      status =  'error';
      console.log(data);
    }

    if (sockets[user]) {
      sockets[user].emit('payment-status', {
        status: status
      });
    }
  });
};

module.exports = process_payment;
