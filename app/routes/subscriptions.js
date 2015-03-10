var express = require('express');
var passport = require('passport');
var app = require('../app');
var subscriptions = express.Router();
var isAuthenticated = require('../middleware/auth/authorize');

var check_subscription = require('../middleware/subscriptions/check');

subscriptions.get('/', isAuthenticated, check_subscription);

module.exports = subscriptions;
