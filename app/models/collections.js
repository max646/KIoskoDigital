var mongoose = require('mongoose');
var q = require('q');
var Issue = require('./issues').model;

var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
  issues: [Schema.Types.ObjectId],
  Owner: Schema.Types.ObjectId
});

CollectionSchema.methods.findIssues = function() {
  var defer = q.defer();
  Issue.find({
    _id: {
        $in: this.issues
      }
    }, function(err, issues) {
      if(err) {
        defer.reject(err);
      } else {
        defer.resolve(issues);
      }
  });

  return defer.promise;
};

var CollectionModel = null;

try {
  CollectionModel = mongoose.model('collection')
} catch (err) {
  CollectionModel = mongoose.model('collection', CollectionSchema)
}

module.exports = {
  model: CollectionModel,
  schema: CollectionSchema
};