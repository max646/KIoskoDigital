var Issues = require('../../../models/issues').model;

module.exports = function(req, res) {

   Issues.find({}, function(err, issues){
       if(err){
           res.send(400, {error: err.message});
       } else {
           res.send({
               issues: issues
           });
       };
    });
};