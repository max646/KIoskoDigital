var passport = require('passport'),
    FacebookTokenStrategy = require('passport-facebook-token').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    GooglePlusStrategy = require('passport-google-plus'),
    mongoose = require('mongoose'),
    UserSchema = require('../../models/Users'),
    User = mongoose.model('user', UserSchema);

var app = require('../../app');

passport.use(new BasicStrategy(User.authenticate()));

passport.use(new FacebookTokenStrategy({
    clientID: app.get('config').facebook.client_id,
    clientSecret:  app.get('config').facebook.client_secret,
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreateByFacebook({ profile: profile }, function (err, user) {
      return done(err, user);
    });
}));

passport.use(new GooglePlusStrategy({
  clientId: '821404490810-uf8km2d84s9q0rvcum37e4l13925i8ic.apps.googleusercontent.com',
  clientSecret: 'GP5plQPD1PX9LGGe9RDbBuNV',
  redirectUri: 'http://local.revisbarcelona.com:4200'
}, function(tokens, profile, done) {
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
      req.body.code = auth[1];
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
