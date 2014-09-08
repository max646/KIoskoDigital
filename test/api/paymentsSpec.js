var request = require('supertest');
var app = require('../../app/app');

describe('/payments', function() {
  describe('GET', function() {
    it('should return the available forms of payments for a specified subscription', function(done) {
      request(app)
        .get('/payments', {
          type: 'mercadopago',
          subscription: 1
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          done();
        });
    });
  });
});
