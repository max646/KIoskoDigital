var express = require('express');
var app = require('../../app');
var voucher = express.Router();
var isAuthenticated = require('../../middleware/auth/authorize');
var isAdmin = require('../../middleware/admin/auth/check');

var detail = require('../../middleware/admin/vouchers/detail');
var addVoucher = require('../../middleware/admin/vouchers/create');
var activate = require('../../middleware/admin/vouchers/activate');
var remove = require('../../middleware/admin/vouchers/delete');

voucher.post('/', isAuthenticated, isAdmin, addVoucher);
voucher.post('/:id/activate', isAuthenticated, isAdmin, activate);

voucher.get('/:id', isAuthenticated, isAdmin, detail);

voucher.delete('/:id', isAuthenticated, isAdmin, remove);

module.exports = voucher;