const database = require('../modules/database');

module.exports = function() {
    return new Promise((resolve, reject) => {
        database.Zone.findAll({
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