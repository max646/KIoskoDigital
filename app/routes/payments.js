var express = require('express');
var MP = require('mercadopago');
var app = require('../app');
var process_payment = require('../middleware/mercadopago/process_payment');

var payments = express.Router();

payments.post('/mp-process', process_payment);

module.exports = payments;
