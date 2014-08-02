#!/usr/bin/env node
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var eson = require('eson');
var mongoose = require('mongoose');
var users = require('./routes/users');
var collections = require('./routes/collections');
var morgan = require('morgan'),
 cors = require('cors');

var app = module.exports = express();


var config_file = __dirname + '/config/' + app.get('env') + '.json';
var config = eson().use(eson.args()).read(config_file);

app.set('base_url', config.base_url);

mongoose.connect(config.mongodb);
var db = mongoose.connection;

app.use(morgan());
app.use(passport.initialize());

app.use(bodyParser());
app.use(function(req, res, next) {
  res.set('Content-Type', 'application/json');
  next();
});

app.use(cors());

app.use('/users', users);
app.use('/collections', collections);

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
