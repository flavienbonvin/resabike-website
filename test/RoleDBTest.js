/*var db = require('../db/RoleDB');

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
})*/


var db = require('./modules/database');
db.Role.create({
    //id:1,
    name: 'abc'
}).then((role) => {
    db.Role.find({
        where: {
            id: role.id
        }
    }).then((role) => {
        console.log("\n\n\n\nfind unique");
        console.log(role);
        db.Role.findAll().then((roles) => {
            console.log("\n\n\n\nfind all");
            console.log(roles);
        }).then(() => {
            db.Role.destroy({
                where: {
                    name: 'abc'
                }
            }).then(() =>{
                db.close();
            })
        })
    })

})
