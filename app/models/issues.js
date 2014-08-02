var mongoose = require('mongoose');
var Publication = require('./publications');

var Schema = mongoose.Schema;

var IssueSchema = new Schema({
  title: String,
  number: String,
  assets: {
    cover: String,
    main: String
  },
  published_on: {type: Date, default: Date.now}
});

module.exports =  {
  schema: IssueSchema,
  model: mongoose.model('issue', IssueSchema)
};
