var q = require('q'),
    Issues = require('../../../models/issues').model;

module.exports = function(req, res) {

    if(!req.body.auto) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Issues.create({draft:true, active: false}, function(err, issue){
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, {issue: issue});
        }
    });
};