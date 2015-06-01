var q = require('q'),
    ObjectId = require('mongoose').Types.ObjectId,
    Promotions = require('../../../models/promotions').model;
    Vouchers = require('../../../models/vouchers').model;

module.exports = function(req, res) {

    if(!req.params.id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Vouchers.findByIdAndRemove(req.params.id, function(err, voucher){
        if (err) {
            res.send(400, err);
        } else {
            Promotions.update({ coupons: ObjectId(req.params.id) }, { '$pull': { coupons: ObjectId(req.params.id) } }, function(err, res){
                //console.log(res);
            });
            res.send(200, { voucher: voucher });
        }
    });
};