var app = require('../../app');
var config = app.get('config');
var q = require('q');

var checkPendingDiscount = require('../vouchers/discount');

module.exports = {

    // params.title
    // params.picture_url
    // params.description
    // params.price
    // params.user
    // params.payment_id

    regular: function(params) {

        var defer = q.defer();

        checkPendingDiscount(params.user._id).then(function(promotion){

                var price = params.price.usd;
                var description = params.description;

                if(promotion) {
                    price = params.price.usd - ((params.price.usd * promotion.discount_percentage)/100);
                    description = params.description + ' con ' + promotion.discount_percentage + '% de descuento.';
                }

                defer.resolve({
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": config.paypal.redirect_urls,
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": params.title,
                                "sku": params.payment_id,
                                "price": price,
                                "currency": "USD",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "total": price,
                            "currency": config.paypal.currency
                        },
                        "description": description
                    }]
                });
        })
        .fail(function(err){
            defer.reject(err);
        });

        return defer.promise;

    },

    recurrent: function(params) {
        var defer = q.defer();

        checkPendingDiscount(params.user._id).then(function(promotion) {

            var price = params.price.usd;
            var description = params.description;

            var startDate = new Date();
            startDate.setHours(startDate.getHours() + 10); // temporally resolve a bug

            if (promotion) {
                price = params.price.usd - ((params.price.usd * promotion.discount_percentage) / 100);
                description = params.description + ' con ' + promotion.discount_percentage + '% de descuento.';
                var endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
            }

            defer.resolve({});
        })
        .fail(function(err){
            defer.reject(err);
        });

        return defer.promise;
    }
};