var express = require('express'),
  passport = require('passport'),
  users = require('../../models/users'),
  q = require('q');

var collections = express.Router();

collections.get('/', passport.authenticate('basic'), function(req, res) {
  if (req.user) {
    q.when(req.user.findMainCollection())
      .done(function(collection) {
        if (collection === null) {
          res.send({
            collections: [],
            issues: []
          });
          return;
        }
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
                    cover: issue.cover,
                    main: issue.main
                  };
                })
              });
          });
      });
    } else {
      req.send({message: 'not valid user'});
    }
});

module.exports = collections;
