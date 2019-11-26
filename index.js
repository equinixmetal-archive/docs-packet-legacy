const fs = require('fs');
const path = require('path');

const test = 'images/api-integrations/Project-ID.png';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
      let dirPath = path.join(dir, f);
      let isDirectory = fs.statSync(dirPath).isDirectory();
      isDirectory ? 
        walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
  };

walkDir('./products', function(filePath) {
    if (path.extname(filePath) == '.md') {
        

        var contents = fs.readFileSync(filePath, 'utf8');

        var regex = /(\!\[.+\]\(.+\))/g;
        var found = contents.match(regex);

        if (found) {
            console.log("----------");
            console.log(filePath);
            console.log("----------");
            for (var i = 0; i < found.length; i++) {
                var temp_path = JSON.stringify(found[i], null, 2);
                var firstIndex = temp_path.indexOf('/images');
                var new_path = temp_path.substring(firstIndex + 1, temp_path.length - 2);
                var exists = fs.existsSync(new_path);
                if (!exists) console.log("Missing image: ", new_path);
            }
        }
    }
});


//Missing image:  "![Screen-Shot-2018-12-03-at-8.31.48-PM.png](https://support.packet.com/file.php/local/303905WCCXWAGDARANNMD0/Screen-Shot-2018-12-03-at-8.31.48-PM.png
//![add VLAN jpg](https://raw.githubusercontent.com/packethost/docs/master/images/layer-2-overview/add-vlan.jpg "Add a VLAN")