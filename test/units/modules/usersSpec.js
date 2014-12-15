var assert = require('asssert');

var User = require('../../../app/middleware/users');
var user_mock = require('../../mocks/user');
var user;

beforeEach(function() {
  user = new User(user_mock.raw); 
});

describe('A User', function() {
  it('should be created using its username', function(done) {
    
  });
});
