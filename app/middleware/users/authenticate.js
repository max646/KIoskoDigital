var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../../models/users');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var authenticate = function(req, res, next) {
  var new_user = req.body.user;
  User.register(new User({
    username: new_user.username
  }),
  new_user.password,
  function(err, user){
    if (err) {
      res.send({error: 700});
      console.log(err);
    }
    res.send({
      user: {
        username: user.username
      }
    });
  });
};

module.exports = authenticate;
