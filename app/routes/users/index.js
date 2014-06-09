var express = require('express'),
  usersMw = require('../../middleware/users');


var users = express.Router();

users.post('/', usersMw.authenticate);

module.exports = users;
