var express = require('express');
var app = require('../../app');
var isAuthenticated = require('../../middleware/admin/auth/authorize');

var promotions = express.Router();

var list = require('../../middleware/admin/promotions/list');
var detail = require('../../middleware/admin/promotions/detail');
var create = require('../../middleware/admin/promotions/create');
var remove = require('../../middleware/admin/promotions/delete');
var activate = require('../../middleware/admin/promotions/activate');
var edit = require('../../middleware/admin/promotions/edit');


promotions.get('/', isAuthenticated, list);
promotions.get('/:id', isAuthenticated, detail);

promotions.post('/', isAuthenticated, create);
promotions.post('/:id/activate', isAuthenticated, activate);
promotions.post('/:id', isAuthenticated, edit);

promotions.delete('/:id', isAuthenticated, remove);

module.exports = promotions;