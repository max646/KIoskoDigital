var mongoose = require('mongoose'),
  app = require('../app'),
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

UserSchema.methods.createCollection = function() {
  var that = this;
  return Collection.create({
   owner: this._id,
   issues: [app.get('first_issue')]
  }, function(err, collection) {
    console.log(err);
    that.collections.push(collection._id);
     that.save();
  });
};

UserSchema.methods.findSubscription = function() {
  return Subscription.findOne({
    owner: this._id
  });
};

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
