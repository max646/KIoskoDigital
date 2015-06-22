var express = require('express');
var isAuthenticated = require('../../middleware/auth/authorize');
var isAdmin = require('../../middleware/admin/auth/check');
var multiparty = require('connect-multiparty');

var issues = express.Router();

var list = require('../../middleware/admin/issues/list');
var create = require('../../middleware/admin/issues/create');
var remove = require('../../middleware/admin/issues/delete');
var activate = require('../../middleware/admin/issues/activate');
var detail = require('../../middleware/admin/issues/detail');
var upload = require('../../middleware/admin/issues/upload');

issues.get('/', isAuthenticated, isAdmin, list);
issues.get('/:id', isAuthenticated, isAdmin, detail);

issues.post('/', isAuthenticated, isAdmin, create);
issues.post('/:id/activate', isAuthenticated, isAdmin, activate);
issues.post('/:id/upload', multiparty(), isAuthenticated, isAdmin, upload);

issues.delete('/:id', isAuthenticated, isAdmin, remove);

module.exports = issues;
