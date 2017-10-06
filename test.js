var zonem = require('./modules/admin/zoneManagement');
var db = require('./modules/database');
var zone = require('./modules/admin/zoneManagement');
var render = require('./modules/renderAddon');
var fs = require('fs');
var opn = require('opn');

zone.listWithDetails().then((res) => {
    var obj = JSON.parse(JSON.stringify(res));
    var op = render.readableObject(obj);
    fs.writeFileSync('index.html',op);
    opn('./index.html');
    db.close();
})