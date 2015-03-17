var q = require('q'),
    User = require('../../models/users').model;

module.exports = function(req, res){
    if(!req.body.username) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    User.checkUsername(req.body.username)
        .then(function(user) {
            res.send({
                user: {
                    id: user._id,
                    username: user.username,
                    created_at: user.created_at,
                    modified_at: user.modified_at,
                    facebook_id: user.facebook_id,
                    google_id: user.google_id,
                    collections: user.collections,
                    active: user.active
                },
                exist: true,
                error: null
            });
        })
        .fail(function(err){
            if(err){
                res.send({
                    error: err.message,
                    user: null,
                    exist: false
                });
            }
        });

};
