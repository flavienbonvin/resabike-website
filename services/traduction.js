 module.exports = function(query,session) {
    return new Promise((resolve,reject) => {
        var label = query.label;
        var lang = query.lang;
        var fichier = require('../lang/'+lang);
        resolve(fichier[label]);
    })
   
}