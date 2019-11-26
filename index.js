const fs = require('fs');
const path = require('path');

const test = 'images/api-integrations/Project-ID.png';

const exists = fs.existsSync(test);
console.log(exists);


var contents = fs.readFileSync('./test.md', 'utf8');

var regex = /(\!\[.+\]\(.+\))/g;
var found = contents.match(regex);

for (var i = 0; i < found.length; i++) {
    var temp_path = JSON.stringify(found[i], null, 2);
    var firstIndex = temp_path.indexOf('/images');
    var new_path = temp_path.substring(firstIndex + 1, temp_path.length - 2);
    console.log(fs.existsSync(new_path));
}