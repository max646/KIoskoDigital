var chai = require('chai'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  app = require('../../app/app');

after(function(done) {
  mongoose.connection.on('disconnected', done);
  mongoose.connection.close();
});

describe('/', function() {
  describe('GET', function() {
    it('Should return the server status', function(done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, {
          status: "OK"
        }, done);
      });
  });
});
