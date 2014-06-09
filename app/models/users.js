var mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
