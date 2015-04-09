var mongoose = require('mongoose');
var q = require('q');

var Promotion = require('./promotions').model;

var Schema = mongoose.Schema;

var VoucherSchema = new Schema({
    coupon_code: String, //coupon code
    used_times: Number,
    limit_of_use: Number,
    days_of_validity: Number,
    created_at: {
        type: Date,
        default: Date.now
    },
    expired_at: Date,
    active: {
        type: Boolean,
        default: true
    }
});

VoucherSchema.statics.checkCouponCode = function(couponCode){
    var defer = q.defer();

    this.findOne({ coupon_code: couponCode })
        .$where('this.used_times < this.limit_of_use') //used times
        .where('expired_at').gt(Date.now()) //it is valid date
        .where('active').equals(true) //it is active
        .exec(function(err, couponCode) {
            if (err) {
                defer.reject(err);
            } else if (couponCode === null) {
              defer.reject({message: 'El código de descuento que has ingresado no es válido.'});
            } else {
                defer.resolve(couponCode);
            }
        });

    return defer.promise;
};

VoucherSchema.methods.getPromotion = function() {
    var defer = q.defer();

    Promotion.findOne({
        coupons: this._id
    }, function(err, promotion) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(promotion);
        }
    });

    return defer.promise;
};

var VoucherModel = null;

try {
    VoucherModel = mongoose.model('voucher')
} catch (err) {
    VoucherModel = mongoose.model('voucher', VoucherSchema)
}

module.exports = {
    model: VoucherModel,
    schema: VoucherSchema
};