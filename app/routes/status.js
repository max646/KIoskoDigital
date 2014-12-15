var express = require('express');
var status = express.Router();

status.get('/', function(req, res) {
  res.send({
    status: "OK"
  });
});

module.exports = status;
