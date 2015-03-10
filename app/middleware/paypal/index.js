var paypal = require('paypal-rest-sdk');

module.exports = function(app) {
    paypal.configure({
        'mode': app.get('config').paypal.mode, //sandbox or live
        'client_id': app.get('config').paypal.client_id,
        'client_secret': app.get('config').paypal.client_secret
    });
    app.set('paypal', paypal);
    return paypal;
};
