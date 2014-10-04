#!/usr/bin/env node
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var eson = require('eson');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');
var app = module.exports = express();
var MP = require('mercadopago');
var MP_CONST = require('./config/mercadopago');

app.use(cors());

var server = require('http').Server();
var io = require('socket.io')(server);
app.set('io', io);
server.listen(3001);

app.set('mp', new MP(MP_CONST.config.clientId, MP_CONST.config.clientSecret));

app.set('first_issue', '53b3791643875a10e359feee');

// routes
var users = require('./routes/users');
var collections = require('./routes/collections');
var subscriptions = require('./routes/subscriptions');
var payments = require('./routes/payments');
var issues = require('./routes/issues');


var config_file = __dirname + '/config/' + app.get('env') + '.json';
var config = eson().use(eson.args()).read(config_file);

app.set(config);

mongoose.connect(config.mongodb);
var db = mongoose.connection;

app.use(morgan());
app.use(passport.initialize());

app.use(bodyParser());
app.use(function(req, res, next) {
  res.set('Content-Type', 'application/json');
  next();
});




app.use('/users', users);
app.use('/collections', collections);
app.use('/issues', issues);
app.use('/subscriptions', subscriptions);
app.use('/payments', payments);

app.get('/', function(req, res) {
  res.send(200, {
    status: "OK"
  });
});


db.on('error', console.log.bind(console, 'Moongose error: '));
db.once('open', function() {
  app.listen(config.port, function() {
    console.log("Listening on port: " + config.port);
  });
});

module.exports = app;
