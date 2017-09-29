var db = require('./modules/database');
var apiconn = require('./modules/adminApiConn');


// db.sync().then(() => {
//     db.close();
// });



apiconn.getStopsForLine("Sion, gare", "Dixence, Le Chargeur").then((res) => {
    apiconn.insertLineInDB(res).then();
}).catch((message) =>{
    console.log(message)
})
