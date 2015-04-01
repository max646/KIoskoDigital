var q = require('q');
var RedemptionVoucher = require('../../models/redemption_vouchers').model;
var Voucher = require('../../models/vouchers').model;

var REDEMPTION_VOUCHER_STATUS = require('../../config/redemption_voucher_status');

module.exports = function (user_id) {
    var defer = q.defer();

    RedemptionVoucher
        .findOne({user: user_id, status: REDEMPTION_VOUCHER_STATUS.PENDING})
        .sort('created_at')
        .exec(function(err, redemption_voucher) {
            if (err) {
                defer.reject(err);
            } else {
                if(redemption_voucher) {
                    Voucher
                        .findOne({_id: redemption_voucher.voucher})
                        .where('expired_at').gt(Date.now()) //it is valid date
                        .where('active').equals(true) //it is active
                        .exec(function (err, voucher) {
                            if (err) {
                                defer.reject(err);
                            } else {
                                voucher.getPromotion().then(function (promotion) {
                                    defer.resolve(promotion);
                                });
                            }
                        });
                } else {
                    defer.resolve(null);
                }
            }
        });

    return defer.promise;
};