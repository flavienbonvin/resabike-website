 module.exports = function(query,session) {
    return new Promise((resolve,reject) => {
        var lang = query.lang;
        var fichier = require('../lang/'+lang);
        resolve(fichier);
    })
   
}