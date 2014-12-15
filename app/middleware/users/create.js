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
  console.log(req.body);
  console.log(req.param('username'));
  registerUser(new User({
    username: req.param('username'),
  }), req.param('password'))
  .done(function(user) {
    req.user = user;
    next();
  });
};

module.exports = {
  create: create
};
