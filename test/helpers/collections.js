var Collections = require('../../app/models/collections').model,
  collections_mock = require('../mocks/collection');

var create = function(cb) {
  Collections.create(collections_mock, cb);
};

var clean = function(cb) {
  Collections.remove({}, cb);
};

module.exports = {
  create: create,
  clean: clean
};
