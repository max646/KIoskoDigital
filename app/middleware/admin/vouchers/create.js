var q = require('q'),
    Voucher = require('../../../models/vouchers').model;

module.exports = function(req, res) {
    if(!req.body.voucher || !req.body.voucher.coupon_code) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Voucher.checkAndCreate(req.body.voucher)
        .then(function(voucher){
            res.send(200, { voucher: voucher });
        })
        .fail(function(err){
            if(err){
                res.send(400, {
                    error: err.message,
                    voucher: null,
                    valid: false
                });
            }
        });
};
