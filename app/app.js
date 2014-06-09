var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var eson = require('eson');
var mongoose = require('mongoose');

var app = express();


var config_file = __dirname + '/config/' + app.get('env') + '.json';
var config = eson().use(eson.args()).read(config_file);

mongoose.connect(config.mongodb);
var db = mongoose.connection;

app.use(passport.initialize());
app.use(bodyParser());

var users = require('./routes/users');
app.use('/users', users);

app.use(function(req, res, next) {
  res.set('Content-Type', 'application/json');
  next();
});

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
