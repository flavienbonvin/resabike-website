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
        var res = [];
        database.Zone.findAll().then((list) => {
            for (var i = 0; i < list.length; i++) {
                database.Line.findAll({ where: { idZone: list[i].id } }).then((listStation) =>{
                    var temp = {
                        id:0,
                        name:'zone',
                        stations : [
                            {
                                id:0,
                                name:'line1'
                            },
                            {
                                id:1,
                                name:'line2'
                            }
                        ]
                    }
                })
            }
        })
    }
}