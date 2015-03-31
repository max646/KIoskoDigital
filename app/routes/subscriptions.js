var express = require('express');
var app = require('../app');
var subscriptions = express.Router();
var isAuthenticated = require('../middleware/auth/authorize');
var check_subscription = require('../middleware/subscriptions/check');
var plans = require('../middleware/subscriptions/plans');

subscriptions.get('/', isAuthenticated, check_subscription);

subscriptions.get('/plans', plans);

module.exports = subscriptions;
