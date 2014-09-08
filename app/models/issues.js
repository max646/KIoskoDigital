var mongoose = require('mongoose');
var Publication = require('./publications');

var Schema = mongoose.Schema;
var Pages = new Schema({
  file: String
});

var IssueSchema = new Schema({
  title: String,
  number: String,
  cover: String,
  main: String,
  published_on: {type: Date, default: Date.now},
  pages: [Pages]
});

module.exports =  {
  schema: IssueSchema,
  model: mongoose.model('issue', IssueSchema)
};
