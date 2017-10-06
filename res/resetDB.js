var db = require('../modules/database');
var Role = require('../objects/Role');
var Zone = require('../objects/Zone');
var Station = require('../objects/Station');
var Line = require('../objects/Line');
var roles = [];

var LineManagement = require('../modules/admin/lineManagement');


roles.push(
    new Role(1, 'Bus driver').convertToSequelize(),
    new Role(2, 'Zone admin').convertToSequelize(),
    new Role(3, 'System admin').convertToSequelize())



db.sync().then(() => {

    db.Role.bulkCreate(roles).then(() => {
        var zone = new Zone(1, 'Anniviers');
        db.Zone.create(
            zone.convertToSequelize()
        ).then(() => {
            zone = new Zone(2, 'Hérens')
            db.Zone.create(
                zone.convertToSequelize()
            ).then(() => {
                var body = {
                    departFinal: 'Sierre, poste/gare',
                    arriveeFinal: 'Vissoie, poste',
                    zoneFinal: 1
                }
                LineManagement.prepareStation(body).then(() => {
                    var body = {
                        departFinal: 'Vissoie, poste',
                        arriveeFinal: 'Zinal, village de vacances',
                        zoneFinal: 1
                    }
                    LineManagement.prepareStation(body).then(() => {
                        var body = {
                            departFinal: 'Sion, poste/gare',
                            arriveeFinal: 'Les Haudères, poste',
                            zoneFinal: 2
                        }
                        LineManagement.prepareStation(body).then(() => {
                            db.close();
                        });
                    });
                })
            })


        })

    })
});