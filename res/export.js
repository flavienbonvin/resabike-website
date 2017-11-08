var fs = require('fs');
var rimraf = require('rimraf');

var copy = require('recursive-copy');

var directory = __dirname + '/../';
var exportDirectory = directory + '../export/';
var files = [
    "bin", "lang", "modules", "node_modules", "objects", "public", "routes", "services", "views","app.js","index.html","package.json"
]


if (fs.existsSync(exportDirectory)) {
    rimraf(exportDirectory, function () {
        
        fs.mkdirSync("../export");
        copyfolder(0).then(() =>{
            
        })
    })
}else{
    fs.mkdirSync("../export");
    copyfolder(0).then(() =>{
        
    })
}

function copyfolder(i){
    return new Promise((resolve,reject) => {
        if(i==files.length){
            resolve();
            return;
        }
        copy(directory+files[i], exportDirectory+files[i], function(error, results) {
            if (error) {
                console.error('Copy failed: ' + error);
            } else {
                console.info('Copied ' + results.length + ' files');
                copyfolder(i+1).then(() => {
                    resolve();
                })
            }
        });
    })
    
}
