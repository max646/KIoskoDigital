var app = require('../../app');
var config = app.get('config');

module.exports = {

    // params.id
    // params.email
    // params.picture
    // params.description
    // params.price
    regular: function(params) {
        var mp_preference = {
            "items": [{
                "id": params.id,
                "title": params.title,
                "currency_id": "ARS",
                "picture_url": params.picture_url,
                "description": params.description,
                "quantity": 1,
                "unit_price": params.price
            }],
            "payer": {
                "email": params.user.username
            },
            "external_reference": params.payment_id,
            "back_urls": config.mercadopago.back_urls,
            "auto_return": config.mercadopago.auto_return
        };
        return mp_preference;
    },

    recurrent: function(params) {
        var currentDate = new Date();
        var nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth()+1);
        var recurrent_payment =  {
            "payer_email": params.user.username,
            "back_url": 'http://revisbarcelona08.com:83',
            "reason": params.description,
            "external_reference": params.payment_id,
            "auto_recurring": {
                "frequency": 1,
                "frequency_type": "months",
                "transaction_amount": params.price,
                "currency_id": "ARS",
                "start_date": currentDate,
                "end_date": nextMonth
            },
            "back_urls": config.mercadopago.back_urls,
            "auto_return": config.mercadopago.auto_return
        };
        return recurrent_payment;
    }
};