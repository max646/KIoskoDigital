var Users = require('../../app/models/users'),
    user_mock = require('../mocks/user');

var create = function(cb) {
  Users.create(user_mock.hashed, cb);
};

var clean = function(cb) {
  Users.remove({}, cb);
};

module.exports = {
  create: create,
  clean: clean
};
