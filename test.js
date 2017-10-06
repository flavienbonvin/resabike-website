var zonem = require('./modules/admin/zoneManagement');
var db = require('./modules/database');
var zone = require('./modules/admin/zoneManagement');

zone.listWithDetails().then((res) => {
    for (var k in res)
        console.log(res[k]);
})