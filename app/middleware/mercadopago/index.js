var MP = require('mercadopago');

module.exports = function(app) {
    var mp = new MP(app.get('config').mercadopago.client_id, app.get('config').mercadopago.client_secret);
    //comentado hasta lanzar en produccion
    //mp.sandboxMode(app.get('env') !== 'production');
    mp.sandboxMode(true);
    app.set('mp', mp);
    return mp;
};
