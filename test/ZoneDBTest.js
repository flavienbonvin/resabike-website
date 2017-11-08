var db = require('../db/ZoneDB');
var Zone = require('../objects/Zone');

var b = new Zone(-1,'zone1');


db.add(b).then((b) => {
    
    
    db.get(b.id).then((b) =>{
        
        
        db.getAll().then((b) => {
            
            
            db.delete(b[0].id).then(() => {
                
                db.close();
            })
        })
    })
})