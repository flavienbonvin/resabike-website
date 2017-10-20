var db = require('./modules/database');

db.Trips.findAll().then((list) =>{
    var t = JSON.parse(JSON.stringify(list))
    console.log(t);

    console.log(new Date(t[4].startHour).toLocaleString())

})