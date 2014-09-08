var express = require('express');
var passport = require('passport');
var q = require('q');

var Issues = express.Router();

Issues.get('/:id', passport.authenticate('basic'),function(req, res) {
  q.when(req.user.findIssue(req.params.id))
    .done(function(issue) {
      var pages = [];
      var page_count = 0;
      console.log(issue);
      res.send({
          issue: {
              id: issue.id,
              number: issue.number,
              title: issue.title,
              cover: issue.cover,
              main: issue.main,
              pages: issue.pages.map(function(page) {
                var page_id = issue.id + "-" + page_count;
                pages.push({
                  id: page_id,
                  url: issue.main + "/" + page.file
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
