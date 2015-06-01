var express = require('express'),
    create = require('../middleware/users/create'),
    check = require('../middleware/users/check'),
    isAuthenticated = require('../middleware/auth/authorize');

var users = express.Router();

users.post('/', create);
users.post('/check', check);

users.get('/', isAuthenticated, function(req, res) {
  res.send({
    user: [
      {
        id: req.user._id,
        username: req.user.username,
        collections: req.user.collections
      }
    ]
  });
});

module.exports = users;
