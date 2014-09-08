var mongoose = require('mongoose'),
  q = require('q'),
  Collection = require('./collections').model,
  Subscription = require('./subscriptions').model,
  Issues = require('./issues.js').model,
  passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  collections: [Schema.Types.ObjectId]
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.addSubscription = function(duration) {
  var new_subscription = new Subsciption();
}

UserSchema.methods.findSubscription = function() {
  var defer = q.defer();

  Subscription.findOne({
    owner: this._id
  }, function(err, subscription) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(subscription);
    }
  });

  return defer.promise;
}

UserSchema.methods.findCollections = function() {
  var defer = q.defer();

  Collection.find({
    _id: {
      $in: this.collections
    }
    }, function(err, collections) {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(collections);
      }
    });

  return defer.promise;
};

// Finds an issue by its id.
// It will return the issue only if the user has it.
UserSchema.methods.findIssue = function(issue_id) {
  var defer = q.defer();

  Collection.find({
    _id: {
      $in: this.collections
    }
  }, function(err, collections) {
    if (err) {
      defer.reject(err);
    } else {
      var found = false;
      collections.every(function(collection) {
        console.log(issue_id);
        collection.issues.every(function(issue) {
          if (issue === issue) {
            found = true;
            Issues.findOne({
              _id: issue
            }, function(err, issue) {
              defer.resolve(issue);
            })
            return false;
          }
          return true;
        });
        if (found) {
          return false;
        } else {
          return true;
        }
      });

    //  defer.resolve(false);
    }
  })

  return defer.promise;
}

UserSchema.methods.findMainCollection = function() {
  var defer = q.defer();
  Collection.findOne({
    _id: this.collections[0]
  }, function(err, collection) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(collection);
    }
  });

  return defer.promise;
};

module.exports = mongoose.model('user', UserSchema);
