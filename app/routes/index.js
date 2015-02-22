var app = require('../app');

var status = require('./status');
var users = require('./users');
var collections = require('./collections');
var subscriptions = require('./subscriptions');
var payments = require('./payments');
var issues = require('./issues');
var token = require('./token');

app.use('/', status);
app.use('/users', users);
app.use('/collections', collections);
app.use('/issues', issues);
app.use('/subscriptions', subscriptions);
app.use('/payments', payments);
app.use('/token', token);