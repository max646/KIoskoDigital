var auth = require('./create');

var users_middleware = {
  create: auth.create,
};

module.exports = users_middleware;
