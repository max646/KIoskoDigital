var q = require('q');

module.exports = function(req, res, next) {
  q.when(req.user.findSubscription())
    .then(function(subscription) {
      if (subscription) {
        res.send({'subscription': subscription});
        //next(null, subscription);
      } else {
        res.send({error: 'subscription not found.'});
      }

  });
};
