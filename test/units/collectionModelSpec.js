var chai = require('chai'),
  mongoose = require('mongoose'),
  Collections = require('../../app/models/collections'),
  Issues = require('../../app/models/issues'),
  q = require('q');

var expect = chai.expect;
db = mongoose.connection;
mongoose.connect("mongodb://localhost/tests");

beforeEach(function(done) {
    var collection_mock = require('../mocks/collection');
    var collection = new Collections.model(collection_mock);

    db.once('open', function() {
      Collections.model.remove({}, function() {
        collection.save(function() {
          var issues_mock = require('../mocks/issues');
          Issues.model.remove({}, function(){
            Issues.model.create(issues_mock, done);
          });
        });
      });
    });
});

after(function(done) {
  db.once('disconnected', done);
  mongoose.connection.close();
});

describe('A Collection model', function() {
  it ('should be able to query the issues that belongs to it', function(done) {
    Collections.model.findOne(function(err, collection) {
      expect(collection).to.be.a('object');
      q.when(collection.findIssues())
        .done(function(issues) {
          expect(issues.length).to.equals(collection.issues.length);
          issues.forEach(function(issue) {
            expect(collection.issues.indexOf(issue._id)).not.to.equals(-1);
          });
          done();
        });
    });
  });
});
