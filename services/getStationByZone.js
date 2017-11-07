const database = require('../modules/database')

/**
 * Get all stations in a zone
 * 
 * @param {Object} body
 */
module.exports = (body) => {
    return new Promise((resolve, reject) => {
        database.Line.findAll({
            where:{
                idZone:body.zoneId
            },
            include:[
                {
                    model:database.LineStation,
                    include:[
                        {
                            model:database.Station
                        }
                    ]
                }
            ]
        }).then((zoneList) => {
            var res = [];
            for(var i = 0;i<zoneList.length;i++){
                for(var j =0 ;j<zoneList[i].linestations.length;j++){
                    res.push(zoneList[i].linestations[j].station)
                }
            }
            resolve(res)
        });
    })
}