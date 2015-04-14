var MP = require('mercadopago');

module.exports = function(app) {
    var mp = new MP(app.get('config').mercadopago.client_id, app.get('config').mercadopago.client_secret);
    mp.sandboxMode(app.get('config').mercadopago.init_point === 'sandbox');
    app.set('mp', mp);
    return mp;
};
