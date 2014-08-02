var express = require('express'),
  usersMw = require('../../middleware/users'),
  passport = require('passport');

var users = express.Router();

users.post('/', usersMw.create, function(req, res) {
  res.send({
    users: [
      {
        username: req.user.username
      }
    ]
  });
});

users.get('/', passport.authenticate('basic'), function(req, res) {
  res.send({
    links: {
      'users.collections': {
        href: 'http://api.com/users/{users.id}/collections/{collections.id}'
      }
    },
    users: [
      {
        id: req.user.id,
        username: req.user.username,
        collections: req.user.collections
      }
    ]
  });
});

module.exports = users;
