var mongoose = require('mongoose');
var q = require('q');

var Schema = mongoose.Schema;

var PromotionSchema = new Schema({
    promotion_type: String,
    coupon_type: String,
    discount_percentage: Number,
    subscription_plan: Number, // subscription_plan_id if promotion_type value is "subscription_plan"
    coupons: [Schema.Types.ObjectId], //discount coupons
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

var PromotionModel = null;

try {
    PromotionModel = mongoose.model('promotion')
} catch (err) {
    PromotionModel = mongoose.model('promotion', PromotionSchema)
}

module.exports = {
    model: PromotionModel,
    schema: PromotionSchema
};