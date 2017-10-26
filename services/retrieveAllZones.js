const database = require('../modules/database')
/**
 * Get list of all the zones
 */
module.exports = (body,session) => {
    return new Promise((resolve, reject) => {
        var userInfo = session.userInfo;
        var where = {}
        if (userInfo.idZone != null) {
            where = {
                id: userInfo.idZone
            }
        }
        console.log(where);
        database.Zone.findAll({where}).then((zoneList) => {
            resolve(zoneList)
        });
    })
}