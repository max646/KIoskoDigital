var q = require('q'),
    Promotions = require('../../../models/promotions').model;

module.exports = function(req, res) {

    Promotions.findOne({_id: req.params.id}, function(err, promotion){
        if(err){
            res.send(400, {error: err.message});
        } else {
            res.send({
                promotion: promotion
            });
        };
    });
};