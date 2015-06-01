var passport = require('passport');
var BearerStrategy = require('passport-http-bearer');

var Session = require('../../../lib/auth/Session');

passport.use(new BearerStrategy(
	function(token, done) {
		Session
			.getAdminUser(token)
			.then(function(user) {
				return done(null, user);
			}, function(err) {
				return done(err);
			});
	}
));

module.exports = passport.authenticate('bearer', {session: false});