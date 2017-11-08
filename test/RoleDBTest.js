/*var db = require('../db/RoleDB');

var Role = require('../objects/Role');
var b = new Role(1,'admin');


db.add(b).then((b) => {
    
    
    db.get(b.id).then((b) => {
        
        
        db.getAll().then((b) => {
            
            
            db.delete(b[0].id).then(() => {
                
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
        
        
        db.Role.findAll().then((roles) => {
            
            
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
