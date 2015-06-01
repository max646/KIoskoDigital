var q = require('q'),
    Promotions = require('../../../models/promotions').model;

module.exports = function(req, res) {

    if(!req.body.auto) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }

    Promotions.create({draft:true}, function(err, promotion){
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, {promotion: promotion});
        }
    });
};