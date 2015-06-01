var q = require('q'),
    Vouchers = require('../../../models/vouchers').model;

module.exports = function(req, res) {

    Vouchers.findOne({_id: req.params.id}, function(err, voucher){
        if(err){
            res.send(400, {error: err.message});
        } else {
            res.send({
                voucher: voucher
            });
        };
    });
};