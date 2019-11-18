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
console.log(contents);