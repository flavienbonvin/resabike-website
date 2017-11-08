var db = require('../db/UserDB');
var User = require('../objects/User');

var b = new User(-1,1,'max','pass','email@eamil.com',false,5);


db.add(b).then((b) => {
    
    
    
    db.get(b.id).then((b) => {
        
        
        db.getAll().then((b) => {
            
            
            db.delete(b[0].id).then(() => {
                
                db.close();
            })
        })
    })
})