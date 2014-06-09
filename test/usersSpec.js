var chai = require('chai'),
  request = require('supertest'),
  users = require('../app/models/users.js');
  app = require('../app/app.js');

beforeEach(function(done) {
  users.remove({}, function() {
    done();
  });
});

describe('POST /users', function() {
  it('Should create a new user', function(done) {
    request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        user: {
          username: 'test',
          password: 'test123'
        }
      })
      .expect(200, {
        user: {
          username: 'test'
        }
      }, done);
  });
});
