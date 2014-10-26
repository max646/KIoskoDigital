var express = require('express');
var passport = require('passport');
var isAuthenticated = require('../middleware/auth/passport');
var q = require('q');

var Issues = express.Router();

Issues.get('/:id', isAuthenticated, function(req, res) {
  q.when(req.user.findIssue(req.params.id))
    .done(function(err, issue) {
      if (err || !issue) {
        res.send([]);
        return;
      }
      var pages = [];
      var page_count = 0;
      res.send({
          issue: {
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
          },
          pages: pages
      });
    });
});

module.exports = Issues;
