var Zone = require('../objects/Zone');

var database = require('../modules/database');

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
    }
}