var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    User = require('../../models/users');

passport.use(new BasicStrategy(function(username, password, cb) {
  User.findOne({username: username}, function(err, user) {
    if (err) { return cb(err); }

    if (!user) {return cb(null, false); }

    user.verifyPassword(password, function(err, isMatch) {
      if (err) { return cb(err); }

      if (!isMatch) {return cb(null, false);}

      return cb(null, user);
    });
  });
}));
