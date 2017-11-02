var database = require('../database');
var Book = require('../../objects/Book');
var Trip = require('../../objects/Trip');
var Trailer = require('../../objects/Trailer');
var sha256 = require('sha256');
var email = require('../email');
var axios = require('axios');

const nbMaxVelo = 6;


var self = module.exports = {

    addBook(body, langUsed) {
        return new Promise((resolve, reject) => {
            var token = sha256('token' + body.bookPseudo + new Date() + Math.random());
            //on crée une reservation avec le status en attente
            var book = new Book(null, body.bookIdStartStation, body.bookIdEndStation, body.bookPseudo, body.bookEmail, body.bookNumber, token, false);
            database.Book.create(book.convertToSequelize()).then((book) => {
                // on recupère la reservation et on demande toutes les lignes dans la reservation
                self.getAllStationId(body).then((stationsId) => {
                    var trips = [];
                    var trailersPromise = [];
                    var status = true;
                    var dateAffichage = stationsId[0].departTime.split(' ')[0];

                    // on crée tous les objets trip pour les ajouter a la db
                    var trip;
                    for (var i = 0; i < stationsId.length; i++) {
                        if (stationsId[i].nbPlaceRestant - body.bookNumber < 0) {
                            status = false;
                            trip = new Trip(null, stationsId[i].realDepart, stationsId[i].departTime, stationsId[i].numeroLine, book.id, stationsId[i].idDepart, stationsId[i].idFin, false).convertToSequelize();
                        } else {
                            trip = new Trip(null, stationsId[i].realDepart, stationsId[i].departTime, stationsId[i].numeroLine, book.id, stationsId[i].idDepart, stationsId[i].idFin, true).convertToSequelize();
                        }
                        trips.push(trip);
                        var trailer = new Trailer(null, stationsId[i].realDepart, body.bookNumber, false, true, stationsId[i].numeroLine);
                        trailersPromise.push(self.checkTrailer(trailer));

                    }

                    Promise.all(trailersPromise).then(() => {
                        database.Trips.bulkCreate(trips).then(() => {
                            if (status) {
                                database.Book.update({
                                    status: true
                                }, {
                                        where: {
                                            id: book.id
                                        }
                                    }).then(() => {
                                        self.sendEmailOK(dateAffichage, body, token, langUsed).then(() => {
                                            resolve();
                                        })
                                    })
                            } else {
                                self.sendEmailWait(dateAffichage, body, token, langUsed).then(() => {
                                    resolve();
                                })
                            }
                        })
                    })

                })
            })
        })
    },
    /**
     * 
     * @param {Trailer} trailer 
     */
    checkTrailer(trailer) {
        return new Promise((resolve, reject) => {
            database.Trailer.find({
                where: {
                    idLine: trailer.idLine,
                    startHour: trailer.startHour
                }
            }).then((trailerFind) => {
                if (trailerFind == null) {
                    database.Trailer.create(trailer.convertToSequelize()).then(() => {
                        resolve();
                    })
                } else {
                    var newNbVelo = Number(trailerFind.nbBike) + Number(trailer.nbBike);
                    var newStatus = true;
                    if (newNbVelo > nbMaxVelo && trailer.status) {
                        newStatus = false;
                    }
                    database.Trailer.update({
                        nbBike: newNbVelo,
                        status: newStatus
                    }, {
                            where: {
                                id: trailerFind.id
                            }
                        }
                    ).then(() => {
                        resolve();
                    })
                }
            })
        })
    },

    sendEmailOK(dateAffichage, body, token, langUsed) {
        return new Promise((resolve, reject) => {
            email.createEmail(body.bookEmail, 'Votre reservation du ' + dateAffichage, `<p>Bonjour,</p>
            <p>Votre r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e.</p>
            <p>Pour annuler votre reservation <a href="http://127.0.0.1:10008/${langUsed}/book/cancel/${token}">cliquez ici</a></p>`).then(() => {
                    resolve();
                })
        })
    },
    sendEmailWait(dateAffichage, body, token, langUsed) {
        return new Promise((resolve, reject) => {
            email.createEmail(body.bookEmail, 'Votre reservation du ' + dateAffichage, `<p>Bonjour,</p>
            <p>Votre r&eacute;servation est en attente. Vous allez recevoir un email de confirmation d'ici peu.</p>
            <p>Pour annuler votre reservation <a href="http://127.0.0.1:10008/${langUsed}/book/cancel/${token}">cliquez ici</a></p>`).then(() => {
                    resolve();
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
                stationsPromise.push(self.findRealStartHour(body, i));
            }
            Promise.all(stationsPromise).then((res) => {
                var list = [];
                for (var i = 0; i < res.length; i += 3) {
                    var j = i / 3;

                    var dateTemp = body['departTime' + j].split(" ");

                    var dateCurrent = dateTemp[0].split('.');
                    dateCurrent = dateCurrent[2] + '-' + dateCurrent[1] + '-' + dateCurrent[0];

                    var temp = {
                        idDepart: res[i].id,
                        realDepart: res[i + 2],
                        departTime: dateCurrent + ' ' + dateTemp[1],
                        idFin: res[i + 1].id,
                        numeroLine: body['idLine' + j],
                        nbPlaceRestant: Number(body['nbPlaceRestant' + j])
                    }
                    list.push(temp);

                }
                resolve(list);
            })
        })
    },

    findRealStartHour(body, i) {
        return new Promise((resolve, reject) => {
            database.Line.find({
                where: {
                    id: body['idLine' + i]
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
            }).then((line) => {
                var dateTemp = body['departTime' + i].split(" ");
                var dateCurrent = dateTemp[0].split('.');
                dateCurrent = dateCurrent[2] + '-' + dateCurrent[1] + '-' + dateCurrent[0];
                dateTemp[1] = dateTemp[1].split(':');
                dateTemp[1] = dateTemp[1][0] + ':' + dateTemp[1][1]
                var urlApi = "https://timetable.search.ch/api/route.en.json?from=" + line.startStation.name + "&to=" + line.endStation.name + "&date=" + dateTemp[0] + "&time=" + dateTemp[1];
                console.log("Api to get realHour :" + urlApi)
                axios.get(urlApi).then((response) => {
                    var connections = response.data.connections;
                    console.log(response.data)
                    for (var j = 0; j < connections.length; j++) {
                        var realDep = new Date(connections[j].departure);
                        var realFin = new Date(connections[j].arrival);
                        var currentTime = new Date(dateCurrent + ' ' + dateTemp[1] + ':00');
                        console.log(realDep + " " + currentTime + " " + realFin);
                        if (connections[j].legs[0].line && connections[j].legs[0].line == line.id.split('-')[1]) {
                            if (currentTime >= realDep && currentTime <= realFin) {
                                resolve(realDep);
                                return;
                            }
                        }
                    }
                })
            })
        })
    },

    findBooking(id) {
        return new Promise((resolve, reject) => {
            database.Book.find({
                where: {
                    token: id
                },
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
                console.log(book)
                book = JSON.parse(JSON.stringify(book));
                var dateTimeTemp = new Date(book.trips[0].startHour).toLocaleString().split(' ');
                var date = dateTimeTemp[0].split('-');
                date = date[2] + '.' + date[1] + '.' + date[0];
                var time = dateTimeTemp[1].split(':');
                time = time[0] + ':' + time[1];
                book.trips[0].startHour = date + ' ' + time;
                resolve(book);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    deleteBooking(id) {
        return new Promise((resolve, reject) => {
            database.Book.destroy({
                where: {
                    token: id
                }
            }).then((bookTemp) => {
                resolve();
            }).catch((error) => {
                reject(error);
            })
        })
    },

    findAllBooking() {
        return new Promise((resolve, reject) => {
            database.Book.findAll({
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