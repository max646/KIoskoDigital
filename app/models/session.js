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

var SessionModel = null;

try {
  SessionModel = mongoose.model('session')
} catch (err) {
  SessionModel = mongoose.model('session', SessionSchema)
}

module.exports = {
  schema: SessionSchema,
  model: SessionModel
};
