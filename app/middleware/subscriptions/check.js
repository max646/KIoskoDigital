var q = require('q');

module.exports = function(req, res, next) {
  q.when(req.user.findSubscription())
    .then(function(subscription) {
      if (subscription) {
        res.send({
          subscription: {
            id: subscription._id,
            active: subscription.active,
          }
        });
      } else {
        res.send({
          subscription: {
            id: 0,
            active: false
          }
        });
      }

  });
};
