var zonem = require('./modules/admin/zoneManagement');
var db = require('./modules/database');
var zone = require('./modules/admin/zoneManagement');
var render = require('./modules/renderAddon');
var connection = require('./modules/client/connectionManagement');
var fs = require('fs');
var opn = require('opn');

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