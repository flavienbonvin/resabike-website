var database = require('../database');
var Book = require('../../objects/Book');
var Trip = require('../../objects/Trip');

var self = module.exports = {

    addBook(body) {
        return new Promise((resolve, reject) => {
            var token = 'token';
            var book = new Book(null, body.bookIdStartStation, body.bookIdEndStation, body.bookPseudo, body.bookEmail, body.bookNumber, token);
            database.Book.create(book.convertToSequelize()).then((book) => {
                self.getAllStationId(body).then((stationsId) => {
                    console.log(stationsId)
                    var trips = [];
                    for (var i = 0; i < stationsId.length; i++) {
                        var trip = new Trip(null, stationsId[i][1], stationsId[i][3], book.id, stationsId[i][0], stationsId[i][2]).convertToSequelize();
                        trips.push(trip);
                    }
                    database.Trips.bulkCreate(trips).then(() => {
                        resolve();
                    })
                })
            })
        })
    },

    getAllStationId(body) {
        return new Promise((resolve, reject) => {
            var stationsPromise = [];
            for (var i = 0; i < Number(body.nbLine); i++) {
                stationsPromise.push(database.Station.find({
                    where: {
                        name: body['depart' + i]
                    }
                }))
                stationsPromise.push(database.Station.find({
                    where: {
                        name: body['sortie' + i]
                    }
                }))
            }
            Promise.all(stationsPromise).then((res) => {
                var list = [];
                for (var i = 0; i < res.length; i += 2) {
                    var j = i / 2;
                    list.push([res[i].id, body['departTime' + j], res[i + 1].id, Number(body['idLine' + j])]);

                }
                resolve(list);
            })
        })
    }
}