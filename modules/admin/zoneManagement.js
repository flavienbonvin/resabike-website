var Zone = require('../../objects/Zone');

var database = require('../database');

module.exports = {

    /**
     * 
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
    listWithDetails() {
        return new Promise((resolve, reject) => {
            database.Zone.findAll({
                include : database.Line
            }).then((list) => {
                resolve(list);
            })
        })
    }
}