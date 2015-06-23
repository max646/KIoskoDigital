var q = require('q'),
    Issues = require('../../../models/issues').model;

module.exports = function(req, res) {
    if(!req.body.issue || !req.body.issue._id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Issues.findOne({_id: req.body.issue._id}, function(err, issue){
        if(err){
            res.send(400, {error: err.message});
        } else {
            issue.title = req.body.issue.title;
            issue.number = req.body.issue.number;
            if(issue.draft) {
                issue.active = true;
                issue.draft = false;
            }
            issue.save();
            res.send({
                issue: issue
            });
        };
    });
};