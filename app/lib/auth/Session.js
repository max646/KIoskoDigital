var RSVP = require('rsvp');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var SessionSchema = require('../../models/session');

var sessionModel = mongoose.model('session', SessionSchema);

module.exports = {
  /*
   * Creates and store a new session Token.
   *
   * @method create
   * @param {Object} a user model
   * @return {Promise} The token created
  */

  create: function(user) {
    return new RSVP.Promise(function(resolve, reject) {
      sessionModel.create({
        access_token: uuid.v1(),
        user: user._id
      }, function(err, token) {
        if (err) {reject(err);}
        resolve(token.access_token);
      });
    });
  },

  /*
   * 
  */

  getUser: function(token) {
    return new RSVP.Promise(function(resolve, reject) {
      sessionModel.findOne({access_token: token})
        .populate('user')
        .exec(function(err, token) {
          if (err) {
            reject(err)
          } else {
            if (token.user) {
              resolve(token.user); 
            } else {
              resolve(null);
            }
          }
        });
    });
  },

  end: function(token) {
    return new RSVP.Promise(function(resolve, reject) {
      sesisonModel.findOneAndRemove({access_token: token}, function() {
        console.log('remove', arguments);
      });
    });
  }
};
