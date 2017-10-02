var db = require('../modules/database');
var Role = require('../objects/Role');
var Zone = require('../objects/Zone');
var roles = [];


db.sync().then(() => {
    roles.push(
        new Role(1, 'Bus driver').convertToSequelize(),
        new Role(2, 'Zone admin').convertToSequelize(),
        new Role(3, 'System admin').convertToSequelize())
    db.Role.bulkCreate(roles).then(() => {
        var zone = new Zone(1, 'Anniviers');
        db.Zone.create(
            zone.convertToSequelize()
        ).then(() =>{
            db.close();
        })
        
    })
});