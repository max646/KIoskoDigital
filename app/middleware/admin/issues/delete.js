var q = require('q'),
    Issues = require('../../../models/issues').model;

module.exports = function(req, res) {

    if(!req.params.id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Issues.findByIdAndRemove(req.params.id, function(err, issue){
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, {issue: issue});
        }
    });
};