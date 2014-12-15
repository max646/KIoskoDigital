var path = require('path');
var app = require('../app');
var eson = require('eson');

var config_file = path.join(__dirname, app.get('env') + '.json');
var config = eson().use(eson.args()).read(config_file);

module.exports = config;
