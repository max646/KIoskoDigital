var chai = require('chai'),
  request = require('supertest'),
  Issue = require('../app/models/issues'),
  app = require('../app/app'),
  issues_mock = require('./mocks/issues');


var cleanUsers = function(done) {
  Issues.remove({}, function() {
    done();
  });
};

var createUser = function(done) {
  var test_issue = new Issue(issue_mock.hashed);
  test_issue.save(done);
};

beforeEach(cleanUsers);
afterEach(cleanUsers);

describe('/users', function() {
  describe('POST', function() {
    it('Should create a new user', function(done) {
      request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(user_mock.raw)
        .expect(200, {
          users: [{
            username: 'test'
          }]
        }, done);
    });
  })

  describe('GET', function() {
    beforeEach(createUser);
    it('Should authenticate a user', function(done) {
      request(app)
        .get('/users/')
        .set('Accept', 'application/json')
        .auth('test', 'test123')
        .expect(200, {
          users: [{
            username: 'test'
         }]
       }, done);
    });
  });
});
