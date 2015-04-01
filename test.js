var str = require('./app/libs/strutil');
console.log(str.isAlphanumeric('d'));

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('file', 'utf8'));

var fs = require('fs');
var obj;
fs.readFile('file', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
});