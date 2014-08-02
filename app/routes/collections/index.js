var express = require('express'),
  passport = require('passport'),
  users = require('../../models/users'),
  q = require('q');

var collections = express.Router();

var mocked_user = function(req, res, next) {
  users.find({}, function(err, user) {
    req.user = user[0];
    next();
  });

};

collections.get('/', /*passport.authenticate('basic'),*/ mocked_user, function(req, res) {
  q.when(req.user.findMainCollection())
    .done(function(collection) {
      q.when(collection.findIssues())
        .done(function(issues) {
            res.send({
              collections: [
                {
                  id: collection.id,
                  issues: collection.issues
                }
              ],
              issues: issues.map(function(issue) {
                return {
                  id: issue.id,
                  number: issue.number,
                  title: issue.title,
                  assets: issue.assets
                };
              })
            });
        });

    });
});

module.exports = collections;
