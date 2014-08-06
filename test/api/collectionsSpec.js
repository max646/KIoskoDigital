var chai = require('chai'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  Collections = require('../../app/models/collections').model,
  Issues = require('../../app/models/issues').model,
  Users = require('../../app/models/users'),
  app = require('../../app/app'),
  user_mock = require('../mocks/user'),
  issues_mock = require('../mocks/issues'),
  collection_mock = require('../mocks/collection');

beforeEach(function(done) {
  Users.remove({}, function() {
    Collections.remove({}, function() {
      Issues.remove({}, function() {
        done();
      });
    });
  });
});

describe("/collections/main", function() {
  beforeEach(function(done) {
    Users.create(user_mock.hashed, function() {
      Collections.create(collection_mock, function() {
        Issues.create(issues_mock, function() {
          done();
        });
      });
    });
  });

  describe('GET', function() {
    it('should return the user\'s main collection', function(done) {
      this.timeout(10000);
      request(app)
        .get('/collections/main')
        .set('Accept', 'application/json')
        .auth(user_mock.raw.username, user_mock.raw.password)
        .expect(200, {
          collections: [{
            id: collection_mock._id,
            issues: collection_mock.issues
          }],
          issues: issues_mock.map(function(issue){
              return {
                id: issue._id,
                title: issue.title,
                number: issue.number,
                cover: issue.assets,
                main: issue.main
              };
            })
        }, done);
    });
  });
});
