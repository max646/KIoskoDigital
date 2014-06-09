var chai = require('chai'),
  request = require('supertest'),
  app = require('../app/app.js');

app.set('env', 'testing');

describe('GET /', function() {
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
