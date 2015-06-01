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
            promotion.name = req.body.promotion.name;
            promotion.description = req.body.promotion.description;
            promotion.promotion_type = req.body.promotion.promotion_type;
            promotion.coupon_type = req.body.promotion.coupon_type;
            promotion.discount_percentage = req.body.promotion.discount_percentage;
            promotion.subscription_plan = req.body.promotion.subscription_plan;
            promotion.expired_at = req.body.promotion.expired_at;
            promotion.draft = false;
            promotion.save();
            res.send({
                promotion: promotion
            });
        };
    });
};