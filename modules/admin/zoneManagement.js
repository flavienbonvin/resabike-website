var Zone = require('../../objects/Zone');

var database = require('../database');
var renderAddon = require('../../modules/renderAddon');

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
    listWithDetails(userInfo) {
        return new Promise((resolve, reject) => {
            console.log('info : ' + userInfo.idZone);
            var where = {}
            if (userInfo.idZone != null) {
                where = {
                    id: userInfo.idZone
                }
            }
            console.log(where);
            database.Zone.findAll({
                where,
                include: [
                    {
                        model: database.Line,
                        include: [
                            {
                                model: database.Station,
                                as: 'startStation'
                            },
                            {
                                model: database.Station,
                                as: 'endStation'
                            }
                        ]
                    }
                ]
            }).then((list) => {
                list = JSON.parse(JSON.stringify(list));
                resolve(list);
            }).catch((error) => {
                reject(error);
            })
        })
    }
}