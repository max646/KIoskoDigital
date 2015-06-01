var q = require('q'),
    Users = require('../../../models/users').model;

module.exports = function(req, res) {
    if(!req.body.user || !req.body.user._id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    if(req.user.id === req.body.user._id) {
        res.send(400, {error: 'You can not help but be administrator.'});
        return false;
    }

    Users.findOne({_id: req.body.user._id}, function(err, user){
        if(err){
            res.send(400, {error: err.message});
        } else {
            user.admin = req.body.user.admin;
            user.save();
            res.send({
                user: user
            });
        };
    });
};