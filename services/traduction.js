 module.exports = function(label,lang) {
    var fichier = require('../lang/'+lang);
    return fichier[label];
}