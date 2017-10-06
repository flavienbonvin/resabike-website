var Zone = require('../../objects/Zone');

var database = require('../database');

module.exports = {

    /**
     * Create a new zone
     * @param {string} body 
     */
    createZone(body) {
        return new Promise((resolve, reject) => {

            var zone = new Zone(null, body.zoneName);

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

    /**
     * Delete a zone
     * @param {string} body 
     */
    deleteZone(body) {
        return new Promise((resolve, reject) => {
            database.Zone.destroy({
                where: {
                    id: body.idToDel
                }
            }).then((zoneTemp) => {
                resolve();
            }).catch((error) => {
                reject(error);
            })
        })
    },
    /**
     * Update a given zone
     * @param {string} body 
     */
    updateZone(body) {
        return new Promise((resolve, reject) => {
            database.Zone.update({
                name: body.newName
            }, {
                    where: {
                        id: body.idToUpdate
                    }
                }).then((zoneTemp) => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                })
        })
    },
    /**
     * List all zones and the line they have
     */
    listWithDetails() {
        return new Promise((resolve, reject) => {
            database.Zone.findAll({
                include : database.Line
            }).then((list) => {
<<<<<<< HEAD
                console.log(list)
=======
                console.log(list);
>>>>>>> 8bbaa0da48a9ec164501525d4912fb5c8a6b4a2d
                resolve(list);
            }).catch((error) => {
                reject(error);
            })
        })
    }
}