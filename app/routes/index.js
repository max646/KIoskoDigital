var app = require('../app');

var site = {
    status:                 require('./status'),
    users:                  require('./users'),
    collections:            require('./collections'),
    subscriptions:          require('./subscriptions'),
    payments:               require('./payments'),
    issues:                 require('./issues'),
    token:                  require('./token'),
    payment_methods:        require('./payment_methods'),
    vouchers:               require('./vouchers'),
    redemption_vouchers:    require('./redemption_vouchers')
};

var admin = {
    promotions:             require('./admin/promotions'),
    token:                  require('./admin/token'),
    users:                  require('./admin/users'),
    vouchers:               require('./admin/vouchers'),
    issues:               require('./admin/issues')
};


//Frontend routes
app.use('/', site.status);
app.use('/users', site.users);
app.use('/collections', site.collections);
app.use('/issues', site.issues);
app.use('/subscriptions', site.subscriptions);
app.use('/payments', site.payments);
app.use('/token', site.token);
app.use('/paymentMethods', site.payment_methods);
app.use('/vouchers', site.vouchers);
app.use('/redemptionVouchers', site.redemption_vouchers);


//Backend routes
app.use('/admin/promotions', admin.promotions);
app.use('/admin/token', admin.token);
app.use('/admin/users', admin.users);
app.use('/admin/vouchers', admin.vouchers);
app.use('/admin/issues', admin.issues);
