const database = require('../modules/database')

module.exports = (body) => {
    return new Promise((resolve, reject) => {
        database.Line.findAll({
            where: {
                idZone: body.zoneId
            },
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
        }).then((lineList) => {
            lineList = JSON.parse(JSON.stringify(lineList));
            console.log(lineList)
            resolve(lineList);
        }).catch((error) => {
            reject(error);
        })
    })
}