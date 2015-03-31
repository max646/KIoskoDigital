var express = require('express');
var app = require('../app');
var voucher = express.Router();
var is_authenticated = require('../middleware/auth/authorize');

var check_coupon_code = require('../middleware/vouchers/check');
var redeem_subscription_plan = require('../middleware/vouchers/redeem_subscription_plan');

voucher.post('/check', is_authenticated, check_coupon_code);
voucher.post('/redeem/subscription_plan', is_authenticated, redeem_subscription_plan);

module.exports = voucher;