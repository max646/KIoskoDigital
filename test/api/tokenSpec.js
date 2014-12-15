var mongoose = require('mongoose');
var request = require('supertest');
var assert = require('assert');
var app = require('../../app');

var users_helpers= require('../helpers/users');
var user_mock = require('../mocks/user');


beforeEach(users_helpers.create);
afterEach(users_helpers.clean);

describe('/token', function() {
  describe('POST', function() {
    it('should create a token', function(done) {
      request(app)
        .post('/token')
        .set('Accept', 'application/json')
        .auth(user_mock.raw.username, user_mock.raw.password)
        .expect(200)
        .end(function(err, res) {
          assert.ok(res.body.session.token);
          done();
        });
    });
  });
});
