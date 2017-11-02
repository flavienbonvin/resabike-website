 module.exports = function(query,session) {
    var label = query.label;
    var lang = query.lang;
    console.log(query)
    var fichier = require('../lang/'+lang);
    console.log(fichier[label])
    return fichier[label];
}