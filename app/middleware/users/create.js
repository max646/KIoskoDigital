var q = require('q'),
User = require('../../models/users').model;

var registerUser = function(user, password) {
    var defer = q.defer();
    User.register(new User({username: user}), password, function(err, user){
        if (err) {
            defer.reject(err);
        } else {
            user.createCollection();
            defer.resolve(user);
        }
    });

    return defer.promise;
};

module.exports = function(req, res) {
    if(!req.body.user || !req.body.user.username || !req.body.user.password) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }
    registerUser(req.body.user.username, req.body.user.password)
        .then(function(user){
            res.send({
                users: [
                    {
                        id: user._id,
                        username: user.username,
                        created_at: user.created_at,
                        modified_at: user.modified_at,
                        facebook_id: user.facebook_id,
                        google_id: user.google_id,
                        collections: user.collections,
                        active: user.active
                    }
                ]
            });
        })
        .fail(function (err) {
            if(err){
                res.send(400, {error: err.message});
            }
        });
};
