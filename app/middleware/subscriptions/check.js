var q = require('q');

module.exports = function(req, res) {
  q.when(req.user.findSubscription())
    .then(function(subscription) {
      if (subscription) {
        res.send({'subscription':
            [{
                id: subscription._id,
                active: subscription.active,
                created_at: subscription.created_at,
                modified_at: subscription.modified_at,
                expired_at: subscription.expired_at,
                duration: subscription.duration,
                status: subscription.status,
                owner: subscription.owner
            }]
        });
      } else {
        res.send({'subscription': []});
      }

  });
};
