const database = require('../modules/database');

module.exports = function(query,session) {
    return new Promise((resolve, reject) => {
        var userInfo = session.userInfo;
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