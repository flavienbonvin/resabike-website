var Zone = require('../../objects/Zone');

var database = require('../database');
var renderAddon = require('../../modules/renderAddon');
var lineManagement = require('./lineManagement');

module.exports = {

    /**
     * Create a new zone
     * 
     * @param {Object} body 
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
     * 
     * @param {Object} body 
     */
    deleteZone(body) {
        return new Promise((resolve, reject) => {
            database.Line.findAll({
                where: {
                    idZone: body.idToDel
                }
            }).then((list) => {
                var promises = []
                for (var i = 0; i < list.length; i++) {
                    var body = {
                        idToDel: list[i].id
                    }
                    promises.push(lineManagement.deleteLine(body))
                }
                Promise.all(promises).then(() => {
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
            })
        })
    },

    /**
     * Update a given zone
     * 
     * @param {Object} body 
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
            var where = {}
            if (userInfo.idZone != null) {
                where = {
                    id: userInfo.idZone
                }
            }
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