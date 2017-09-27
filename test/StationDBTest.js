var db = require('../db/StationDB');

var Station = require('../objects/Station');

var b = new Station(-1, 'station1', 15.20, 30.55);

console.log('insertion station')
db.add(b).then((b) => {
    console.log('station inserted')
    console.log('station by id')
    db.get(b.id).then((b) => {
        console.log(b)
        console.log('get all station')
        db.getAll().then((b) => {
            console.log(b);
            console.log('suppression');
            db.delete(b[0].id).then(() => {
                console.log('suppression réussi');
                db.close();
            })
        })
    })
})