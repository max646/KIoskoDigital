var q = require('q'),
    Promotions = require('../../../models/promotions').model;

module.exports = function(req, res) {

   Promotions.find({}, function(err, promotions){
       if(err){
           res.send(400, {error: err.message});
       } else {
           res.send({
               promotions: promotions
           });
       };
    });
};