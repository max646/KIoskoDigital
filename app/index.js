var app = require('./app');
var config = require('./config');

var mongoose = require('mongoose');
mongoose.connect(app.get('config').mongodb);
mongoose.connection.db.on('error', console.log.bind(console, 'Moongose error: '));
mongoose.connection.db.once('open', function() {
  app.listen(app.get('config').port, function() {
    console.log("Listening on port: " + app.get('config').port);
  });
});

module.exports = app;
