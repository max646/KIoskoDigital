var q = require('q'),
    Promotions = require('../../../models/promotions').model;
    Vouchers = require('../../../models/vouchers').model;

module.exports = function(req, res) {

    if(!req.params.id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Promotions.findByIdAndRemove(req.params.id, function(err, promotion){
        if (err) {
            res.send(400, err);
        } else {
            Vouchers.remove({'_id': {'$in': promotion.coupons}}, function(err, vouchers){
                //console.log(vouchers);
            });
            res.send(200, {promotion: promotion});
        }
    });
};