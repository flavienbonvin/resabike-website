var fs = require('fs');
var fsSync = require('fs-sync');
var rimraf = require('rimraf');
var pathWindows = require('path');


var directory = __dirname + '/../';
var exportDirectory = directory + '../export';
var ignoredFile = [
    ".git", ".vscode", "res", "test", ".gitignore", "package-lock.json"
]


if (fs.existsSync(exportDirectory)) {
    rimraf(exportDirectory, function () {
        copyFile(__dirname + '/../').then(() => {
            console.log('fini');
        })
    })
}








function copyFile(path) {
    return new Promise((resolve, reject) => {
        if (isAnIgnoredFile(path)) {
            console.log(path + ' => pas de copy')
            resolve();
            return;
        }
        var newPath = path.replace(directory, exportDirectory);
        newPath = pathWindows.normalize(newPath);

        if (fs.lstatSync(path).isDirectory()) {
            mkdir(newPath).then(() => {
                console.log("creation du dossier " + newPath)
                var content = fs.readdirSync(path);
                var arr = [];
                for (var i = 0; i < content.length; i++) {
                    arr.push(copyFile(path + "/" + content[i]));
                    
                }
                Promise.all(arr).then(() => {
                    resolve();
                })
            })
        } else {
            console.log("copie de "+ newPath)
            fsSync.copy(path, newPath);
            resolve();
        }
    })
}

function isAnIgnoredFile(path) {
    path = path.replace(directory, "");
    for (var i = 0; i < ignoredFile.length; i++) {
        console.log(path + " => " + ignoredFile[i]);
        if (path.indexOf(ignoredFile[i]) != -1) {

            return true;
        }
    }

    return false;
}

function mkdir(path) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, function (err) {
            resolve()
        });
    })
}