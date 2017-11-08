const database = require('../modules/database');

/**
 * Get all users 
 * 
 */
module.exports = (query,session) => {
    return new Promise((resolve, reject) => {
        var userInfo = session.userInfo;
        var where = {}
        if (userInfo.idZone != null) {
            where = {
                idRole : 1,
                idZone : userInfo.idZone
            }
        }
        
        
        database.User.findAll({where}).then((userList) => {
            resolve(userList);
        })
    })
}