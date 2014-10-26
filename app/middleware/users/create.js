var q = require('q'),
User = require('../../models/users');

var registerUser = function(user, password) {
  var defer = q.defer();
  User.register(user, password,
    function(err, user){
      if (err) {
        defer.reject(err);
      } else {
        user.createCollection();
        defer.resolve(user);
      }
    });

  return defer.promise;
};

var create = function(req, res, next) {

  registerUser(new User({
    username: req.body.user.username,
  }), req.body.user.password)
  .done(function(user) {
    req.user = user;
    next();
  });
};

module.exports = {
  create: create
};

