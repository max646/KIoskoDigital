var q = require('q'),
    Issues = require('../../../models/issues').model;

module.exports = function(req, res) {

    Issues.findOne({_id: req.params.id}, function(err, issue){
        if(err){
            res.send(400, {error: err.message});
        } else {
            res.send({
                issue: issue
            });
        };
    });
};