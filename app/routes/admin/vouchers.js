var express = require('express');
var app = require('../../app');
var voucher = express.Router();
var is_authenticated = require('../../middleware/admin/auth/authorize');

var detail = require('../../middleware/admin/vouchers/detail');
var add_voucher = require('../../middleware/admin/vouchers/create');
var activate = require('../../middleware/admin/vouchers/activate');
var remove = require('../../middleware/admin/vouchers/delete');

voucher.post('/', is_authenticated, add_voucher);
voucher.post('/:id/activate', is_authenticated, activate);

voucher.get('/:id', is_authenticated, detail);

voucher.delete('/:id', is_authenticated, remove);

module.exports = voucher;