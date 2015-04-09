var express = require('express');
var app = require('../app');
var redemption_voucher = express.Router();
var is_authenticated = require('../middleware/auth/authorize');

var redemption = require('../middleware/vouchers/redemption');

redemption_voucher.get('/', is_authenticated, redemption);

module.exports = redemption_voucher;