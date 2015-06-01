var q = require('q'),
    Users = require('../../../models/users').model;

module.exports = function(req, res) {

   Users.find({}, function(err, users){
       if(err){
           res.send(400, {error: err.message});
       } else {
           res.send({
               users: users
           });
       };
    });
};