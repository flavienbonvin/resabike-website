var db = require('../db/StationDB');

var Station = require('../objects/Station');

var b = new Station(-1, 'station1', 15.20, 30.55);


db.add(b).then((b) => {
    
    
    db.get(b.id).then((b) => {
        
        
        db.getAll().then((b) => {
            
            
            db.delete(b[0].id).then(() => {
                
                db.close();
            })
        })
    })
})