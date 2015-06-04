module.exports = function(req, res, done) {
	if(!req.user) {
		done(null);
	}

	if(req.user && req.user.admin) {
		done(null, req.user);
	}
};