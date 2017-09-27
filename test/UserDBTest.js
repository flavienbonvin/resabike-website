var db = require('../db/UserDB');
var User = require('../objects/User');

var b = new User(-1,1,'max','pass','email@eamil.com',false,5);

console.log('insertion user');
db.add(b).then((b) => {
    console.log(b);
    console.log('user inserted');
    console.log('get by id');
    db.get(b.id).then((b) => {
        console.log(b);
        console.log('get all');
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