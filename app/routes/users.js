var express = require('express'),
  usersMw = require('../middleware/users'),
  isAuthenticated = require('../middleware/auth/authorize'),
  passport = require('passport');

var users = express.Router();

users.post('/', usersMw.create, function(req, res) {
  res.send({
    users: [
      {
        username: req.body.username
      }
    ]
  });
});

users.get('/', isAuthenticated, function(req, res) {
  res.send({
    users: [
      {
        username: req.user.username,
        collections: req.user.collections
      }
    ]
  });
});

module.exports = users;
