var database = require('../database');
var Book = require('../../objects/Book');
var self = module.exports = {
    /**
     * Find all booking in the database
     */
    findAllBooking(userInfo) {
        return new Promise((resolve, reject) => {
            var where = {}
            if (userInfo.idZone != null) {
                where = {
                    idZone: userInfo.idZone
                }
            }
            database.Book.findAll({
                where,
                include: [
                    {
                        model: database.Station,
                        as: 'startStationBook'
                    },
                    {
                        model: database.Station,
                        as: 'endStationBook'
                    },
                    {
                        model: database.Trips
                    }
                ]
            }).then((book) => {
                book = JSON.parse(JSON.stringify(book));
                for (var i in book) {
                    console.log(book[i].trips)
                    var dateTimeTemp = new Date(book[i].trips[0].startHour).toLocaleString().split(' ');
                    var date = dateTimeTemp[0].split('-');
                    date = date[2] + '.' + date[1] + '.' + date[0];
                    var time = dateTimeTemp[1].split(':');
                    time = time[0] + ':' + time[1];
                    book[i].trips[0].startHour = date + ' - ' + time;
                }
                resolve(book);
            }).catch((error) => {
                reject(error);
            })
        })
    },
}