var express = require('express');
var app = require('../../app');
var isAuthenticated = require('../../middleware/auth/authorize');
var isAdmin = require('../../middleware/admin/auth/check');

var promotions = express.Router();

var list = require('../../middleware/admin/promotions/list');
var detail = require('../../middleware/admin/promotions/detail');
var create = require('../../middleware/admin/promotions/create');
var remove = require('../../middleware/admin/promotions/delete');
var activate = require('../../middleware/admin/promotions/activate');
var edit = require('../../middleware/admin/promotions/edit');


promotions.get('/', isAuthenticated, isAdmin, list);
promotions.get('/:id', isAuthenticated, isAdmin, detail);

promotions.post('/', isAuthenticated, isAdmin, create);
promotions.post('/:id/activate', isAuthenticated, isAdmin, activate);
promotions.post('/:id', isAuthenticated, isAdmin, edit);

promotions.delete('/:id', isAuthenticated, isAdmin, remove);

module.exports = promotions;