var express = require('express'),
  passport = require('passport'),
  users = require('../models/users'),
  q = require('q');

var isAuthenticated = require('../middleware/auth/passport');

var collections = express.Router();

collections.get('/', isAuthenticated, function(req, res) {
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
              var pages = [];
              res.send({
                user: {
                  username: req.user.username
                },
                collections: [
                  {
                    id: collection.id,
                    issues: collection.issues
                  }
                ],
                issues: issues.map(function(issue) {
                  var page_count = 0;
                  return {
                    id: issue.id,
                    number: issue.number,
                    title: issue.title,
                    cover: issue.cover,
                    main: issue.main,
                    pages: issue.pages.map(function(page, index) {
                      var page_id = issue.id + "-" + page_count;
                      pages.push({
                        id: page_id,
                        url: issue.main + "/" + page.file,
                        number: index
                      });
                      page_count++;

                      return page_id;
                    })
                  };
                }),
                pages: pages
              });
          });
      });
    } else {
      req.send({message: 'not valid user'});
    }
});

module.exports = collections;
