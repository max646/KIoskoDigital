#!/usr/bin/env node
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');

var app = module.exports = express();

app.set('config', require('./config'));

require('./middleware/mercadopago')(app);
require('./middleware/paypal')(app);

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.set('Content-Type', 'application/json');
  next();
});

require('./routes');

module.exports = app;
