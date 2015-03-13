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
        var mp_preference = {
            "items": [{
                "id": params.id,
                "title": params.title,
                "currency_id": "ARS",
                "picture_url": params.picture_url,
                "description": params.description,
                "quantity": 1,
                "unit_price": params.price.ars
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
        var startDate = new Date();
        startDate.setHours(startDate.getHours() + 10); // temporally resolve a bug
        var endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + config.mercadopago.recurrent_payment.years_of_term);
        var recurrent_payment =  {
            "payer_email": params.user.username,
            "back_url": config.mercadopago.back_urls.success,
            "reason": params.description,
            "external_reference": params.payment_id,
            "auto_recurring": {
                "frequency": 1,
                "frequency_type": "months",
                "transaction_amount": params.price.ars,
                "currency_id": "ARS",
                "start_date": startDate,
                "end_date": endDate
            }
        };
        return recurrent_payment;
    }
};