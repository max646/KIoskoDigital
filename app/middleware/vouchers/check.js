var q = require('q'),
    Voucher = require('../../models/vouchers').model;


module.exports = function(req, res){
    if(!req.body.coupon_code) {
        res.send(400, {error: 'El cupon de descuento es requerido.'});
        return false;
    }

    Voucher.checkCouponCode(req.body.coupon_code)
        .then(function(voucher) {
            res.send({
                voucher: {
                    id: voucher._id,
                    coupon_code: voucher.coupon_code,
                    created_at: voucher.created_at,
                    expired_at: voucher.expired_at,
                    active: voucher.active
                },
                valid: true,
                error: null
            });
        })
        .fail(function(err){
            if(err){
                res.send({
                    error: err.message,
                    voucher: null,
                    valid: false
                });
            }
        });

};
