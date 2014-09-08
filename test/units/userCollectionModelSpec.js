var chai = require('chai'),
  mongoose = require('mongoose'),
  Users = require('../../app/models/users'),
  Issues = require('../../app/models/issues').model,
  q = require('q');

var expect = chai.expect;

var db = mongoose.connection;
mongoose.connect("mongodb://localhost/tests");

var user_mock = require('../mocks/user').hashed;
var collection_mock = require('../mocks/collection');

before(function(done) {
  db.once('open', function() {
    Users.remove({}, function() {
      Users.create(user_mock, function() {
        Issues.remove({}, function() {
          Issues.create(collection_mock, done);
        });
      });
    });
  });
});

describe('The Users model', function() {
  it('should be able to find the collection that it posses', function(done) {
    Users.findOne({
    }, function(err, user) {
      q.when(user.findMainCollection())
        .done(function(collection) {
          expect(collection).to.have.property('issues').with.length(collection_mock.issues.length);
          done();
        });
    });
  });

  it('should be able to find its active subscriptions', function(done) {
    Users.findOne({
    }, function(err, user) {
      q.when(user.findActiveSubscriptions())
        .done(function(subscriptions) {
          expect(subscriptions).to.have.length(2);
        });
    });
  });
});
