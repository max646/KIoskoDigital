var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    FacebookTokenStrategy = require('passport-facebook-token').Strategy,
    User = require('../../models/users');

var app = require('../../app');

passport.use(new BasicStrategy(User.authenticate()));

passport.use(new FacebookTokenStrategy({
    clientID: app.get('config').facebook.CLIENT_ID,
    clientSecret:  app.get('config').facebook.CLIENT_SECRET,
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreateByFacebook({ profile: profile }, function (err, user) {
      console.log('eso', user);
      console.log(err);
      return done(err, user);
    });
}));

function isAuthenticated(req, res, next) {
  if (req.headers['x-auth'] === 'facebook') {
    passport.authenticate('facebook-token', {session: false})(req, res, next);
  } else {
    passport.authenticate('basic', {session: false})(req, res, next);
  }
}

module.exports = isAuthenticated;
