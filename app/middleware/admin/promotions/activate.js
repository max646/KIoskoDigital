var q = require('q'),
    Promotions = require('../../../models/promotions').model;

module.exports = function(req, res) {
    if(!req.body.promotion || !req.body.promotion._id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Promotions.findOne({_id: req.body.promotion._id}, function(err, promotion){
        if(err){
            res.send(400, {error: err.message});
        } else {
            promotion.active = req.body.promotion.active;
            promotion.save();
            res.send({
                promotion: promotion
            });
        };
    });
};