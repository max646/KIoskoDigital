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
  publication: Schema.Types.ObjectId,
  published_on: {type: Date, default: Date.now},
  modified_at: Date,
  active: {
    type: Boolean,
    default: true
  },
  draft: {
    type: Boolean,
    default: false
  },
  pages: [Pages]
});

var IssueModel = null;

try {
  IssueModel = mongoose.model('issue')
} catch (err) {
  IssueModel = mongoose.model('issue', IssueSchema)
}

module.exports =  {
  schema: IssueSchema,
  model: IssueModel
};