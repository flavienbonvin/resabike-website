var db = require('../db/ZoneDB');
var Zone = require('../objects/Zone');

var b = new Zone(-1,'zone1');

console.log('insert zone');
db.add(b).then((b) => {
    console.log('zone inserted');
    console.log('get by id');
    db.get(b.id).then((b) =>{
        console.log(b);
        console.log('get all');
        db.getAll().then((b) => {
            console.log(b);
            console.log('delete');
            db.delete(b[0].id).then(() => {
                console.log('deleted');
                db.close();
            })
        })
    })
})