var q = require('q'),
    Voucher = require('../../models/vouchers').model,
    RedemptionVoucher = require('../../models/redemption_vouchers').model;

var PROMOTION_TYPES = require('../../config/promotion_types');
var REDEMPTION_VOUCHER_STATUS = require('../../config/redemption_voucher_status');

module.exports = function(req, res){
    if(!req.body.coupon_code) {
        res.send(400, {error: 'Coupon code is empty.'});
        return false;
    }

    Voucher.checkCouponCode(req.body.coupon_code).then(function(voucher) {

        if(voucher) {

            voucher.getPromotion().then(function (promotion) {

                if (promotion && promotion.isValid() && promotion.isActive() && promotion.promotion_type === PROMOTION_TYPES.DISCOUNT) {

                    q.when(req.user.findSubscription()).then(function (subscription) {

                        if (subscription && subscription.active) {
                            res.send(400, {error: 'The coupon code has not been redeemed. You are already subscribed.'});
                        } else {

                            RedemptionVoucher.checkVoucherRedemption(req.body.coupon_code, req.user._id).then(function (redemptionVoucher) {

                                if (redemptionVoucher) {
                                    res.send(400, {error: 'You have redeemed this voucher before. If you have not yet confirmed your subscription continuing to the next step.'});
                                } else {
                                    RedemptionVoucher.create({
                                        voucher: voucher._id,
                                        user: req.user._id,
                                        status: REDEMPTION_VOUCHER_STATUS.PENDING
                                    }, function (err, redemptionVoucher) {

                                        voucher.used_times = voucher.used_times +1;
                                        voucher.save();

                                        res.send({
                                            vouchers: [{
                                                id: voucher._id,
                                                coupon_code: voucher.coupon_code,
                                                created_at: voucher.created_at,
                                                expired_at: voucher.expired_at,
                                                active: voucher.active
                                            }],
                                            'redemptionVouchers':[{
                                                user: redemptionVoucher.user,
                                                voucher: redemptionVoucher.voucher,
                                                created_at: redemptionVoucher.created_at,
                                                status: redemptionVoucher.status
                                            }],
                                            error: null
                                        });
                                    });

                                }
                            })
                                .fail(function (err) {
                                    if (err) {
                                        res.send({
                                            error: err.message,
                                            vouchers: null,
                                            redemptionVouchers: null
                                        });
                                    }
                                });
                        }
                    });
                } else {
                    res.send(400, {error: 'Promotion not valid.'});
                }
            })
                .fail(function (err) {
                    if (err) {
                        res.send({
                            error: err.message,
                            vouchers: null,
                            redemptionVouchers: null
                        });
                    }
                });
        }
    });
};