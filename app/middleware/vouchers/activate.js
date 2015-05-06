var q = require('q'),
    Vouchers = require('../../models/vouchers').model;

module.exports = function(req, res) {
    if(!req.body.voucher || !req.body.voucher.coupon_code) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Vouchers.findOne({_id: req.body.voucher._id}, function(err, voucher){
        if(err){
            res.send(400, {error: err.message});
        } else {
            voucher.active = req.body.voucher.active;
            voucher.save();
            res.send({
                voucher: voucher
            });
        };
    });
};