var passport = require('passport'),
    FacebookTokenStrategy = require('passport-facebook-token').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    GoogleTokenStrategy = require('passport-google-oauth').OAuth2Strategy,
    mongoose = require('mongoose'),
    User = require('../../models/users').model;

var app = require('../../app');

passport.use(new BasicStrategy(User.authenticate()));

passport.use(new FacebookTokenStrategy({
    clientID: app.get('config').facebook.client_id,
    clientSecret:  app.get('config').facebook.client_secret
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreateByFacebook({ profile: profile }, function (err, user) {
      return done(err, user);
    });
}));

passport.use(new GoogleTokenStrategy({
  clientID: app.get('config').google.client_id,
  clientSecret: app.get('config').google.client_secret,
  callbackURL: app.get('config').google.redirectUri
}, function(accessToken, refreshToken, profile, done) {
  User.findOrCreateByGoogle({profile: profile}, function(err, user) {
      return done(err, user);
  });
}));

function isAuthenticated(req, res, next) {
  try {
    var auth = req.headers.authorization.split(' ');
    if (auth[0] === 'Facebook') {
      req.body.access_token = auth[1];
      passport.authenticate('facebook-token', {session: false})(req, res, next);
    } else if (auth[0] === 'Google') {
      req.query.code = auth[1];
      passport.authenticate('google', {session: false})(req, res, next);
    } else {
      passport.authenticate('basic', {session: false})(req, res, next);
    }
  } catch (e) {
    console.log('!');
    res.send(503);
  }
}

module.exports = isAuthenticated;
