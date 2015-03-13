var q = require('q');

module.exports = function(req, res) {
    q.when(req.user.findSubscription()).then(function (subscription) {
        if (subscription) {
            q.when(subscription.findHistoryOfPayment()).then(function (payments) {
                var result = []
                payments.forEach(function (payment) {
                    result.push({
                        id: payment._id,
                        platform: payment.platform,
                        status: payment.status,
                        created_at: payment.created_at,
                        payment_id: payment.payment_id,
                        preference_id: payment.preference_id,
                        token: payment.token,
                        description: payment.description,
                        payer: {
                            id: payment.payer.id,
                            email: payment.payer.email,
                            nickname: payment.payer.nickname
                        }
                    });
                });
                res.send({
                    'payments': result
                });
            });
        } else {
            res.send({'subscription': []});
        }

    });
}