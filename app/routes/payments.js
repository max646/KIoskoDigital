var express = require('express');
var app = require('../app');
var isAuthenticated = require('../middleware/auth/authorize');

var payments = express.Router();

var mp_process_payment = require('../middleware/mercadopago/process_payment');
var pp_process_payment = require('../middleware/paypal/process_payment');
var payment = require('../middleware/payments');
var find_payment = require('../middleware/payments/find_payment');

payments.get('/', isAuthenticated, payment);
payments.get('/:id', isAuthenticated, find_payment);
payments.post('/mp-regular-process', isAuthenticated, mp_process_payment.regular_payment);
payments.post('/mp-recurrent-process', isAuthenticated, mp_process_payment.recurrent_payment);
payments.post('/pp-process', isAuthenticated, pp_process_payment);

module.exports = payments;