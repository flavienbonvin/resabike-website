var zonem = require('./modules/admin/zoneManagement');

zonem.listWithDetails().then((list) =>{
    console.log(list);
})