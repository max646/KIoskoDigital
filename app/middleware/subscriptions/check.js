var q = require('q');

module.exports = function(req, res) {
  q.when(req.user.findSubscription()).then(function(subscription) {
      if (subscription) {
          q.when(subscription.findPayment()).then(function(payment){
              res.send({
                  'subscriptions': [{
                      id: subscription._id,
                      active: subscription.active,
                      created_at: subscription.created_at,
                      modified_at: subscription.modified_at,
                      expired_at: subscription.expired_at,
                      duration: subscription.duration,
                      status: subscription.status,
                      owner: subscription.owner,
                      payment: subscription.payment
                  }],
                  'payments': [{
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
                  }],
                  'users':[{
                      id: req.user._id,
                      username: req.user.username,
                      created_at: req.user.created_at,
                      modified_at: req.user.modified_at,
                      active: req.user.active,
                      facebook_id: req.user.facebook_id,
                      google_id: req.user.google_id
                  }]
              });
          });
      } else {
        res.send({'subscription': []});
      }
  });
};
