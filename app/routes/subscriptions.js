var express = require('express');
var passport = require('passport');
var app = require('../app');
var subscriptions = express.Router();

var create_preference = require('../middleware/subscriptions/preference');
var check_subscription = require('../middleware/subscriptions/check');

var mp = app.get('mp');

mp.sandboxMode(true);

subscriptions.get('/:id', passport.authenticate('basic'), check_subscription, create_preference);

module.exports = subscriptions;