var db = require('./modules/database');
var apiconn = require('./modules/adminApiConn');
var sysManag = require('./modules/sysAdminAccount');
var Role = require('./objects/Role');
var roles = [];


// db.sync().then(() => {
//      roles.push(
//     new Role(1, 'Bus driver').convertToSequelize(), 
//     new Role(2, 'Zone admin').convertToSequelize(), 
//     new Role(3, 'System admin').convertToSequelize())     
//      db.Role.bulkCreate(roles).then(() => {
//         db.close();
//     })
// });


// apiconn.getStopsForLine("Sion, gare", "Dixence, Le Chargeur").then((res) => {
//     apiconn.insertLineInDB(res).then();
// }).catch((message) => {
//     console.log(message)
// })

// db.Zone.create({
//     id: null,
//     name: 'bite'
// }).then(() => {})

// sysManag.createDriver('testDriver', 'password', 'testEMAIL', '1', '1').then(() => {
// }).catch((error) => {
//     console.log(error);
// })
// sysManag.createZoneAdmin('testZoneAdmin', 'password', 'testEMAIL', '1', '1').then(() => {
// }).catch((error) => {
//     console.log(error);
// })
// sysManag.createSystemAdmin('testSysAdmin', 'password', 'testEMAIL', '1', '1').then(() => {
//     db.close();
// }).catch((error) => {
//     console.log(error);
//     db.close();
// })


sysManag.retriveAllZones().then((rs) => {

     for (var k in rs) {
        console.log(rs[k].name)
    }
    db.close();
})