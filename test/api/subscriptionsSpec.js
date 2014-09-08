var request = require('supertest');
var app = require('../../app/app');
var user_mock = require('../mocks/user');

describe('/subscriptions', function() {
  describe('POST', function() {
    it ('should verify the payment and create a new subscription', function(done) {
      request(app)
        .post('/subscription')
        .set('Accept', 'application/json')
        .send({
          subscription: {
            duration: 3
          },
          payment: {
            type: 'mercadopago',
            data: {    }
          }
        })
        .auth(user_mock.raw.username, user_mock.raw.password)
        .expect({
          suscription: {
            start: Date.now,
            end: Date.now
          }
        }, done);
    });
  });
});
