var app = require('../../app');
var config = app.get('config');

module.exports = {

    // params.title
    // params.picture_url
    // params.description
    // params.price
    // params.user
    // params.payment_id

    regular: function(params) {
        var payment = {
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
                        "price": params.price.usd,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": params.price.usd,
                    "currency": config.paypal.currency
                },
                "description": params.description
            }]
        };
        return payment;
    },

    recurrent: function(params) {
        var currentDate = new Date();
        var nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth()+1);
        recurrent_payment = {};
        return recurrent_payment;
    }
};