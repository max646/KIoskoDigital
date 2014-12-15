var express = require('express');
var app = require('../app');
var process_payment = require('../middleware/mercadopago/process_payment');
var passport = require('passport');
var isAuthenticated = require('../middleware/auth/authorize');

var payments = express.Router();

var find_payment_methods = require('../middleware/subscriptions/find_payments_methods');

payments.get('/:id', isAuthenticated, find_payment_methods);

payments.post('/mp-process', process_payment);

module.exports = payments;
