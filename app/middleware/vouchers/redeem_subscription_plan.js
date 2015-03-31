var q = require('q'),
    Voucher = require('../../models/vouchers').model,
    RedemptionVoucher = require('../../models/redemption_vouchers').model,
    Subscription = require('../../models/subscriptions').model,
    Payment = require('../../models/payments').model;

var PAYMENT_TYPES = require('../../config/payment_types');
var PROMOTION_TYPES = require('../../config/promotion_types');

module.exports = function(req, res){
    if(!req.body.coupon_code) {
        res.send(400, {error: 'Coupon code is empty.'});
        return false;
    }

    Voucher.checkCouponCode(req.body.coupon_code).then(function(voucher) {

        if(voucher) {

            voucher.getPromotion().then(function (promotion) {

                if (promotion && promotion.promotion_type === PROMOTION_TYPES.SUBSCRIPTION_PLAN) {

                    q.when(req.user.findSubscription()).then(function (subscription) {

                        if (subscription && subscription.active) {
                            res.send(400, {error: 'The coupon code has not been redeemed. You are already subscribed.'});
                        } else {

                            RedemptionVoucher.checkVoucherRedemption(req.body.coupon_code, req.user._id).then(function (redemptionVoucher) {

                                if (redemptionVoucher) {
                                    res.send(400, {error: 'You have used this voucher before.'});
                                } else {
                                    RedemptionVoucher.create({
                                        voucher: voucher._id,
                                        user: req.user._id

                                    }, function (err, redemptionVoucher) {

                                        var payment = new Payment({
                                            status: PAYMENT_TYPES.FREE,
                                            description: "Promotion: " + promotion._id + ', Coupon Code: ' + voucher.coupon_code
                                        });

                                        payment.save(function (error, payment) {

                                            var subscription = new Subscription({
                                                owner: req.user._id
                                            });

                                            var duration = parseInt(promotion.subscription_plan);
                                            var expired_at = new Date();

                                            if (duration != 1) { //if duration == 1 is recurrent payment else total months
                                                expired_at.setMonth(expired_at.getMonth() + duration);
                                            } else {
                                                expired_at.setMonth(expired_at.getMonth() + 1);
                                            }

                                            subscription.status = 'approved';
                                            subscription.active = true;
                                            subscription.modified_at = Date.now();
                                            subscription.expired_at = expired_at;
                                            subscription.duration = duration;
                                            subscription.payment = payment._id;
                                            subscription.history_of_payments.push(payment._id);

                                            subscription.save(function (err, subscription) {
                                                redemptionVoucher.subscription = subscription._id;
                                                redemptionVoucher.save();

                                                res.send({
                                                    voucher: {
                                                        id: voucher._id,
                                                        coupon_code: voucher.coupon_code,
                                                        created_at: voucher.created_at,
                                                        expired_at: voucher.expired_at,
                                                        active: voucher.active
                                                    },
                                                    error: null
                                                });
                                            });
                                        });
                                    });

                                }
                            })
                            .fail(function (err) {
                                if (err) {
                                    res.send({
                                        error: err.message,
                                        voucher: null
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
                        voucher: null
                    });
                }
            });
        }
    });
};