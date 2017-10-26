const database = require('../modules/database');

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
        console.log(userInfo);
        console.log(where);
        database.User.findAll({where}).then((userList) => {
            resolve(userList);
        })
    })
}