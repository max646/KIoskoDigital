var mongoose = require('mongoose');
var q = require('q');

var Schema = mongoose.Schema;

var RedemptionVouchersSchema = new Schema({
    user: Schema.Types.ObjectId, // user id
    voucher: Schema.Types.ObjectId, //discount coupon
    created_at: {
        type: Date,
        default: Date.now
    },
    subscription: Schema.Types.ObjectId, // subscription id
    payment: Schema.Types.ObjectId // payment_id
});

RedemptionVouchersSchema.statics.checkVoucherRedemption = function(couponCode, userId){
    var defer = q.defer();

    this.findOne({ coupon_code: couponCode, user: userId })
        .exec(function(err, voucherRedemption) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(voucherRedemption);
            }
        });

    return defer.promise;
};

var RedemptionVouchersModel = null;

try {
    RedemptionVouchersModel = mongoose.model('redemption_vouchers')
} catch (err) {
    RedemptionVouchersModel = mongoose.model('redemption_vouchers', RedemptionVouchersSchema)
}

module.exports = {
    model: RedemptionVouchersModel,
    schema: RedemptionVouchersSchema
};