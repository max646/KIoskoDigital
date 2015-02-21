var express = require('express');
var passport = require('passport');
var app = require('../app');
var subscriptions = express.Router();
var isAuthenticated = require('../middleware/auth/authorize');

var create_preference = require('../middleware/subscriptions/preference');
var check_subscription = require('../middleware/subscriptions/check');
//var find_payment_methods = require('../middleware/subscriptions/find_payments_methods');

subscriptions.get('/', isAuthenticated, check_subscription);//, create_preference);

module.exports = subscriptions;
