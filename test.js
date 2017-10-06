var db = require('./modules/database');
var zone = require('./services/getStationByZone');
var render = require('./modules/renderAddon');
var connection = require('./modules/client/connectionManagement');
var fs = require('fs');
var opn = require('opn');
var body = {
    zoneId:1
}

zone(body).then((res) => {
    var obj = JSON.parse(JSON.stringify(res));
    var op = render.readableObject(obj);
    fs.writeFileSync('index.html',op);
    opn('./index.html');
    db.close();
// zone.listWithDetails().then((res) => {
//     var obj = JSON.parse(JSON.stringify(res));
//     var op = render.readableObject(obj);
//     fs.writeFileSync('index.html',op);
//     opn('./index.html');
//     db.close();
// })

var body = {
    from: "Vex, poste",
    to: "Euseigne, Ritzé"
}

connection.getConnectionForTrip(body).then((res) => {
    console.log(res)
})