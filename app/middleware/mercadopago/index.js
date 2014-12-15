var MP = require('mercadopago');
var app = require('../../app');

var mp = new MP(app.get('config').mercadopago.client_id, app.get('config').mercadopago.client_secret);

mp.sandboxMode(app.get('env') !== 'production');

module.exports = mp;
