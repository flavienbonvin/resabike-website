var db = require('../db/RoleDB');

var Role = require('../objects/Role');
var b = new Role(1,'admin');

console.log('insertion du role');
db.add(b).then((b) => {
    console.log('insertion réussi');
    console.log('get by id');
    db.get(b.id).then((b) => {
        console.log(b);
        console.log('get All');
        db.getAll().then((b) => {
            console.log(b);
            console.log('suppression')
            db.delete(b[0].id).then(() => {
                console.log('bien supprimé');
                db.close();
            })
        })
    })
})



