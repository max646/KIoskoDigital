var q = require('q'),
    Users = require('../../../models/users').model;

module.exports = function(req, res) {

    if(!req.params.id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Users.findByIdAndRemove(req.params.id, function(err, user){
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, {user: user});
        }
    });
};