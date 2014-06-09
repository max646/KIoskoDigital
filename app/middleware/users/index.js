var authenticate = require('./authenticate');

var users_middleware = {
  authenticate: authenticate
};

module.exports = users_middleware;
