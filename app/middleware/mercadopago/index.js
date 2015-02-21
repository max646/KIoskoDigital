var MP = require('mercadopago');

module.exports = function(app) {
    var mp = new MP(app.get('config').mercadopago.client_id, app.get('config').mercadopago.client_secret);
    mp.sandboxMode(app.get('env') !== 'production');
    app.set('mp', mp);
    return mp;
};
