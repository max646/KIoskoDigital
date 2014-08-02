var chai = require('chai');
var request = require('supertest');

var app = require('../app/app');

var expect = chai.expect;

describe('POST /publisher', function() {
  it('should create a new publisher', function(done) {
    request(app)
      .post('/publisher')
      .auth('test', 'test123')
      .send({
        name: "Test Revista"
      })
      .expect({
        publishers: [{
          name: "Test Revista"
        }]
      });
  })
});
