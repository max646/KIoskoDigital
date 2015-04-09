var q = require('q'),
    Voucher = require('../../models/vouchers').model,
    RedemptionVoucher = require('../../models/redemption_vouchers').model;

var REDEMPTION_VOUCHER_STATUS = require('../../config/redemption_voucher_status');

module.exports = function(req, res){

    RedemptionVoucher
        .findOne({user: req.user._id, status: REDEMPTION_VOUCHER_STATUS.PENDING})
        .sort('created_at')
        .exec(function(err, redemption_voucher) {
            if(err){
                res.send({
                    error: err.message,
                    redemption_voucher: null
                });
            } else  {
                if(redemption_voucher) {
                    Voucher.findOne({_id: redemption_voucher.voucher}, function(err, voucher){
                        if(err){
                            res.send({
                                error: err.message,
                                redemption_voucher: null
                            });
                        } else  {
                            if (voucher) {
                                res.send({
                                    redemption_vouchers: [{
                                        id: redemption_voucher._id,
                                        voucher: redemption_voucher.voucher,
                                        user: redemption_voucher.user,
                                        status: redemption_voucher.status
                                    }],
                                    users: [{
                                        id: req.user._id,
                                        username: req.user.username,
                                        created_at: req.user.created_at,
                                        modified_at: req.user.modified_at,
                                        active: req.user.active,
                                        facebook_id: req.user.facebook_id,
                                        google_id: req.user.google_id
                                    }],
                                    vouchers: [{
                                        id: voucher._id,
                                        coupon_code: voucher.coupon_code,
                                        created_at: voucher.created_at,
                                        used_times: voucher.used_times,
                                        limit_of_use: voucher.limit_of_use,
                                        expired_at: voucher.expired_at,
                                        active: voucher.active
                                    }],
                                    error: null
                                });
                            }
                        }
                    });
                }
            }
        });
};