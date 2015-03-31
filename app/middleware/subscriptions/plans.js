var SUBSCRIPTION_PLANS = require('../../config/subscription_plans');

module.exports = function(req, res) {
    res.send(200, SUBSCRIPTION_PLANS);
};