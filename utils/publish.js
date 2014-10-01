var fs = require('fs');

if (process.argv.length !== 7) {
  throw 'Format: ./publish.js <numero> <titulo> <cover> <main>';
}

var issue_path = process.argv[6];

var issue = {
  number: process.argv[2],
  title: process.argv[3],
  cover: process.argv[4],
  main: process.argv[5],
  pages: []
};

fs.readdir(issue_path, function(err, files) {
  if (err) throw err;

  files.forEach(function(file) {
    issue.pages.push({
      file: file
    });
  });

  console.log(issue);
});
