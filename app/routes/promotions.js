var express = require('express');
var app = require('../app');
var isAuthenticated = require('../middleware/auth/authorize');

var promotions = express.Router();

var list = require('../middleware/promotions/list');
var detail = require('../middleware/promotions/detail');
var create = require('../middleware/promotions/create');
var remove = require('../middleware/promotions/delete');
var activate = require('../middleware/promotions/activate');
var edit = require('../middleware/promotions/edit');


promotions.get('/', isAuthenticated, list);
promotions.get('/:id', isAuthenticated, detail);
promotions.post('/', isAuthenticated, create);
promotions.delete('/:id', isAuthenticated, remove);
promotions.post('/:id/activate', isAuthenticated, activate);
promotions.post('/:id', isAuthenticated, edit);

module.exports = promotions;