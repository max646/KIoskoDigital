var express = require('express');
var isAuthenticated = require('../middleware/auth/passport');

var Session = require('../lib/auth/Session');

var SessionRoute = express.Router();

SessionRoute.post('/', isAuthenticated, function(req, res) {
  Session
    .create(req.user)
    .then(function(Session) {
      res.send({
          session: {
            token: Session
          }
      });
    }, function() {
      res.send(500);
    });
});

SessionRoute.delete('/:token', function(req, res) {
  Session.end(req.params.token).then(function(token){
    res.send(200, token);
  });
});


module.exports = SessionRoute;
