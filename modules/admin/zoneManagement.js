var Zone = require('../../objects/Zone');

var database = require('../database');

module.exports = {

    /**
     * 
     * @param {string} name 
     */
    createZone(name) {
        return new Promise((resolve, reject) => {

            var zone = new Zone(null, name);

            database.Zone.find({
                where: {
                    name: zone.name
                }
            }).then((zoneTemp) => {
                if (zoneTemp == null) {
                    database.Zone.create(zone.convertToSequelize()).then(() => {
                        resolve();
                    });
                } else {
                    reject("Zone already in the DB");
                }
            })
        })
    },

    deleteZone(body){
        return new Promise((resolve, reject) => {

            database.Zone.find({
                where: {
                    id: body.idToDel
                }
            }).then((zoneTemp) => {
                if (zoneTemp != null){
                    database.Zone.destroy(zoneTemp).then(() => {
                        resolve();
                    });
                } else {
                    reject("Can't find the zone")
                }
            })
        })
    }
}