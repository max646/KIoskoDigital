var mongoose = require('mongoose'),
  q = require('q'),
  Collection = require('./collections').model,
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

UserSchema.methods.findMainCollection = function() {
  var defer = q.defer();
  console.log(this.collections);
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
