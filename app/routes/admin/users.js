var express = require('express');
var isAuthenticated = require('../../middleware/admin/auth/authorize');

var users = express.Router();

var list = require('../../middleware/admin/users/list');
var activate = require('../../middleware/admin/users/activate');
var remove = require('../../middleware/admin/users/delete');
var admin = require('../../middleware/admin/users/admin');

users.get('/', isAuthenticated, list);

users.post('/:id/activate', isAuthenticated, activate);
users.post('/:id/admin', isAuthenticated, admin);

users.delete('/:id', isAuthenticated, remove);

module.exports = users;
