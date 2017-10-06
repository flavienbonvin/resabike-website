var db = require('./modules/database');
var zone = require('./services/getStationByZone');
var render = require('./modules/renderAddon');
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
})