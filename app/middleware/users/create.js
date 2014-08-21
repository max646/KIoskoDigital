var q = require('q'),
  passport = require('passport'),
  DigestStrategy = require('passport-http').BasicStrategy,
  User = require('../../models/users');

passport.use(new DigestStrategy({qop: 'auth'}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
 * Registers a new user.
 * @returns {promise} the user created.
 */
var registerUser = function(user, password) {
  var defer = q.defer();
  User.register(user, password,
    function(err, user){
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(user);
      }
  });

  return defer.promise;
};

/**
 * Creates a new user and stores its data on req._rdigital.user
 *
 * @returns req._rdigital.user
 */
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
