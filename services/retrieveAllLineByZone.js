const database = require('../modules/database')

/**
 * Retrive all line by zone
 * 
 * @param {Object} body
 */
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
            //
            resolve(lineList);
        }).catch((error) => {
            reject(error);
        })
    })
}