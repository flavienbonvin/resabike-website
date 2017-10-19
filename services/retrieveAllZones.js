const database = require('../modules/database')
/**
 * Get list of all the zones
 */
module.exports = () => {
    return new Promise((resolve, reject) => {
        database.Zone.findAll().then((zoneList) => {
            resolve(zoneList)
        });
    })
}