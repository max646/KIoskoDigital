var app = require('../app');

var status = require('./status');
var users = require('./users');
var collections = require('./collections');
var subscriptions = require('./subscriptions');
var payments = require('./payments');
var issues = require('./issues');
var token = require('./token');
var payment_methods = require('./payment_methods');
var vouchers = require('./vouchers');
var redemption_vouchers = require('./redemption_vouchers');
var promotions = require('./promotions');

app.use('/', status);
app.use('/users', users);
app.use('/collections', collections);
app.use('/issues', issues);
app.use('/subscriptions', subscriptions);
app.use('/payments', payments);
app.use('/token', token);
app.use('/paymentMethods', payment_methods);
app.use('/vouchers', vouchers);
app.use('/redemptionVouchers', redemption_vouchers);
app.use('/promotions', promotions);
