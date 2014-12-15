#!/usr/bin/env node
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var passport = require('passport');

var app = module.exports = express();

// TODO: Move to db. Use initializers
app.set('first_issue', '53b3791643875a10e359feee');

app.set('config', require('./config'));


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
