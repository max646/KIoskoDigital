var express = require('express');
var app = require('../app');
var payment_methods = express.Router();
var isAuthenticated = require('../middleware/auth/authorize');

var find_payment_methods = require('../middleware/subscriptions/find_payments_methods');

payment_methods.get('/:id', isAuthenticated, find_payment_methods);

module.exports = payment_methods;