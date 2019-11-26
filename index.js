var fs = require('fs');

var contents = fs.readFileSync('./test.md', 'utf8');

var regex = /(\!\[.+\]\(.+\))/g;
var found = contents.match(regex);

for (var i = 0; i < found.length; i++) {
    console.log(found[i], typeof[found[i]]);
}