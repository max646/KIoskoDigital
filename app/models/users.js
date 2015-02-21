var mongoose = require('mongoose'),
    app = require('../app'),
    q = require('q'),
    bcrypt = require('bcrypt-nodejs'),
    Collection = require('./collections').model,
    Subscription = require('./subscriptions').model,
    passportLocalMongoose = require('passport-local-mongoose'),
    Issues = require('./issues').model;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  facebook_id: String,
  google_id: String,
  collections: [Schema.Types.ObjectId]
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.findOrCreateByFacebook = function(args, cb) {
  return this.findOne({
    facebook_id: args.profile.id
  }, function(err, user) {
    if (err) {cb(err);}
    if (user) {
      cb(null, user);
    } else {
      this.findOne({
        username: args.profile._json.email
      }, function(err, user) {
        if (user) {
          user.facebook_id = args.profile.id;
          user.save();
          cb(null, user);
        } else {
          console.log(args.profile);
          this.create({
            username: args.profile._json.email,
            facebook_id: args.profile.id
          }, function(err, user) {
            console.log(err);
            user.createCollection();
            cb(err, user);
          });
        }
      }.bind(this));
    }
  }.bind(this));
};

UserSchema.statics.findOrCreateByGoogle = function(args, cb) {
  return this.findOne({
    google_id: args.profile.id
  }, function(err, user) {
    if (err) {cb(err);}
    if (user) {
      cb(null, user);
    } else {
      this.findOne({
        username: args.profile.email
      }, function(err, user) {
        if (user) {
          user.google_id = args.profile.id;
          user.save();
          cb(null, user);
        } else {
          this.create({
            username: args.profile.emails[0].value,
            google_id: args.profile.id
          }, function(err, user) {
            user.createCollection();
            cb(err, user);
          });
        }
      }.bind(this));
    }
  }.bind(this));
};


UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

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
    var defer = q.defer();

    Subscription.findOne({
        owner: this._id
    }).exec(function(err, subscription) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(subscription);
        }
    });

    return defer.promise;
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
            });
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
  });

  return defer.promise;
};

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

var UserModel = null;

try {
  UserModel = mongoose.model('user');
} catch (err) {
  UserModel = mongoose.model('user', UserSchema);
}

module.exports = {
  model: UserModel,
  schema: UserSchema
};