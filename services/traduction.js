 module.exports = function(query,session) {
    var label = query.label;
    var lang = query.lang;
    var fichier = require('../lang/'+lang);
    return fichier[label];
}