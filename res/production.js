const fs = require('fs');


var pathToExport = 'C:\\';
var baseExport = pathToExport + 'resabike';
var toIgnore = [
    'node_modules',
    'db',
    'objects',
    'res',
    'test',
    '.git'
];


var rmdirAll = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                rmdirAll(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function readDir(path) {
    var list = fs.readdirSync(path);
    var pathToCopy = baseExport + path.replace('..', '');
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < toIgnore.length; j++) {
            console.log(list[i] + ' : ' + toIgnore[j]);
            var isIgnore = false;
            if (list[i].indexOf(toIgnore[j]) != -1) {
                isIgnore = true;
                j = toIgnore.length;
            }
        }
        if (!isIgnore) {
            if (fs.lstatSync(path + list[i]).isDirectory()) {
                console.log('mkdir de ' + list[i]);
                fs.mkdir(pathToCopy + list[i]);
                readDir(path+list[i]+'/');
            } else {
                console.log('copie de ' + path + list[i] + ' vers ' + pathToCopy + list[i]);
                fs.createReadStream(path + list[i]).pipe(fs.createWriteStream(pathToCopy + list[i]));
            }
        }
    }
}

//console.log(list);
if (fs.existsSync(baseExport)) {
    rmdirAll(baseExport);
}
fs.mkdirSync(baseExport);
readDir('../');

