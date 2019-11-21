var fs = require('fs');

//
// Asynchronous (non-blocking) way
//
// fs.readFile('./test.txt', 'utf8', function(err, contents) {
//     console.log(contents);
// });

// console.log('this shows up before the contents of test.txt');

//
// Synchronous (blocking) way
//
var contents = fs.readFileSync('./test.md', 'utf8');
//console.log(contents);

// function getValueByKey(text, key){
//     var regex = new RegExp("images");
//     var match = regex.exec(text);
//     if(match)
//         return match[1];
//     else
//         return null;
// }

// console.log(getValueByKey(contents, "images"));

var regex = /(\!\[.+\]\(.+\))/g;
var found = contents.match(regex);

for (var i = 0; i < found.length; i++) {
    console.log(found[i], typeof[found[i]]);
}