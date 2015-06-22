var app = require('../../../app');
var config = app.get('config');
var fs = require('fs');
var mkdirp = require('mkdirp');
var lwip = require('lwip');
var path = require('path');
var Issues = require('../../../models/issues').model;

module.exports = function(req, res) {
    if(!req.params.id) {
        res.send(400, {error: 'The required params are empty.'});
        return false;
    }
    Issues.findOne({_id: req.params.id}, function(err, issue){
        if(err){
            res.send(400, {error: err.message});
        } else {
            if(issue) {
                fs.readFile(req.files.file.path, function (err, data) {
                    var imageName = req.files.file.name;

                    if (!imageName) {
                        res.send(400, {error: err.message});
                        return false;
                    } else {
                        var publicDir = "/public/uploads/issues/issue_" + issue._id;
                        var fullsizePath = path.join(__dirname, "../../../.." + publicDir + '/fullsize/');
                        var thumbsPath = path.join(__dirname, "../../../.." + publicDir + '/thumbs/');

                        mkdirp(fullsizePath, function (err) {
                            if (err) {
                                res.send(400, {error: err.message});
                                return false;
                            }
                            fs.writeFile(fullsizePath + imageName, data, function (err) {
                                if (err) {
                                    res.send(400, {error: err.message});
                                    return false;
                                }

                                mkdirp(thumbsPath, function (err) {
                                    if (err) {
                                        res.send(400, {error: err.message});
                                        return false;
                                    }

                                    lwip.open(fullsizePath + imageName, function (err, image) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (image) {
                                            image.batch()
                                                .scale(0.30)
                                                .writeFile(thumbsPath + imageName, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });

                                            issue.main = config.base_url + publicDir + '/fullsize/';
                                            issue.pages.push({file: imageName});
                                            issue.save(function(err, issue) {
                                                res.send(200, {issue: issue});
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            }
        }
    });
};