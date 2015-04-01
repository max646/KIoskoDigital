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

            var price = params.price.ars;
            var description = params.description;

            if(promotion) {
                price = params.price.ars - ((params.price.ars * promotion.discount_percentage)/100);
                description = params.description + ' con ' + promotion.discount_percentage + '% de descuento.';
            }

            defer.resolve({
                "items": [{
                    "id": params.id,
                    "title": params.title,
                    "currency_id": "ARS",
                    "picture_url": params.picture_url,
                    "description": description,
                    "quantity": 1,
                    "unit_price": price
                }],
                "payer": {
                    "email": params.user.username
                },
                "external_reference": params.payment_id,
                "back_urls": config.mercadopago.back_urls,
                "auto_return": config.mercadopago.auto_return
            });
        })
        .fail(function(err){
            defer.reject(err);
        });

        return defer.promise;
    },

    recurrent: function(params) {
        var defer = q.defer();

        checkPendingDiscount(params.user._id).then(function(promotion){

            var startDate = new Date();
            startDate.setHours(startDate.getHours() + 10); // temporally resolve a bug

            var endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + config.mercadopago.recurrent_payment.years_of_term);

            var price = params.price.ars;
            var description = params.description;

            if(promotion) {
                price = params.price.ars - ((params.price.ars * promotion.discount_percentage)/100);
                description = params.description + ' con ' + promotion.discount_percentage + '% de descuento.';
                var endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
            }

            defer.resolve({
                "payer_email": params.user.username,
                "back_url": config.mercadopago.back_urls.success,
                "reason": description,
                "external_reference": params.payment_id,
                "auto_recurring": {
                    "frequency": 1,
                    "frequency_type": "months",
                    "transaction_amount": price,
                    "currency_id": "ARS",
                    "start_date": startDate,
                    "end_date": endDate
                }
            });
        })
        .fail(function(err){
            defer.reject(err);
        });

        return defer.promise;
    }
};