var db = require('./modules/database');


db.Line.find({
    where: {
        id : 50
    }
}).then((line) =>{
    console.log(line);
})