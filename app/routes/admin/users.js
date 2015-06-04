var express = require('express');
var isAuthenticated = require('../../middleware/auth/authorize');
var isAdmin = require('../../middleware/admin/auth/check');

var users = express.Router();

var list = require('../../middleware/admin/users/list');
var activate = require('../../middleware/admin/users/activate');
var remove = require('../../middleware/admin/users/delete');
var admin = require('../../middleware/admin/users/admin');

users.get('/', isAuthenticated, isAdmin, list);

users.post('/:id/activate', isAuthenticated, isAdmin, activate);
users.post('/:id/admin', isAuthenticated, isAdmin, admin);

users.delete('/:id', isAuthenticated, isAdmin, remove);

module.exports = users;
