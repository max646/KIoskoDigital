var
  mongoose = require('mongoose'),
  request = require('supertest'),
  Users = require('../../app/models/users'),
  app = require('../../app/app'),
  user_mock = require('../mocks/user');


var cleanUsers = function(done) {
  Users.remove({}, function() {
    done();
  });
};

var createUser = function(done) {
  var test_user = new Users(user_mock.hashed);
  test_user.save(done);
};

beforeEach(cleanUsers);
afterEach(cleanUsers);

describe('/users', function() {
  describe('POST', function() {
    it('Should create a new user', function(done) {
      request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send({user: user_mock.raw})
        .expect(200, {
          users: [{
            username: user_mock.raw.username
          }]
        }, done);
    });
  });

  describe('GET', function() {
    beforeEach(createUser);
    it('Should authenticate a user', function(done) {
      request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .auth(user_mock.raw.username, user_mock.raw.password)
        .expect(200, {
          links: {
            "users.collections": {
              href: "http://api.com/users/{users.id}/collections/{collections.id}"
            }
          },
          users: [
            {
              id: '53b8c3d7d06cadd303bc49ad',
              username: user_mock.raw.username,
              collections: ['53b615385b1a700000e4c54b']
            }
          ]
       }, done);
    });
  });
});
