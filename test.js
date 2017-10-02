var addon = require('./modules/renderAddon');


var obj = {
    niveau1 :{
        niveau2 :{
            test:'salut',
            hello:'123'
        },
        coucou:"12"
    }
}
var a = addon.readableObject(obj)
console.log(a);