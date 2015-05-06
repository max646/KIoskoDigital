var express = require('express');
var app = require('../app');
var isAuthenticated = require('../middleware/auth/authorize');

var promotions = express.Router();

var list = require('../middleware/promotions/list');
var detail = require('../middleware/promotions/detail');


promotions.get('/', isAuthenticated, list);
promotions.get('/:id', isAuthenticated, detail);

module.exports = promotions;