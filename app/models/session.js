var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SessionSchema = new Schema({
  access_token: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  expired_at: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = SessionSchema;
