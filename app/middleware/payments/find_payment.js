var Payment = require('../../models/payments').model;

module.exports = function(req, res) {
    var id = req.params.id || 0;

    Payment.findById(id, function (err, payment) {
        if (err) {
            res.send(400, {error: 'payment error'});
        } else {
            res.send({
                'payment': payment
            });
        }
    });
};