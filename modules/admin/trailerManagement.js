var db = require('../database');
var email = require('../email');
const maxBikeWithTrailer = 20;

var self = module.exports = {
    getAllTrailer() {
        return new Promise((resolve, reject) => {
            db.Trailer.findAll({
                where: {
                    status: 0
                }
            }).then((trailers) => {
                trailers = JSON.parse(JSON.stringify(trailers));
                for (var i = 0; i < trailers.length; i++) {
                    var datetimeTemp = new Date(trailers[i].startHour).toLocaleString().split(' ');
                    var date = datetimeTemp[0].split('-');
                    date = date[2] + '.' + date[1] + '.' + date[0];
                    var time = datetimeTemp[1].split(':');
                    time = time[0] + ':' + time[1];
                    trailers[i].startHour = date + ' ' + time;
                }
                resolve(trailers)
            })
        })
    },

    takeTrailer(id) {
        return new Promise((resolve, reject) => {
            self.updateTrailerAndReturn(id, 1).then((trailer) => {
                self.updateTripsAndReturn(trailer).then((trips) => {
                    var promiseTemp = [];
                    var nbVelo = 0;
                    for (var i = 0; i < trips.length; i++) {
                        console.log(trips[i]);
                        nbVelo += Number(trips[i].book.number);
                        if (nbVelo <= 20) {
                            // check if book is ok
                            promiseTemp.push(self.checkIsBookIsOk(trips[i].idBook))
                        } else {
                            //remove book
                            nbVelo -= Number(trips[i].book.number);
                            promiseTemp.push(self.destroyBook(trips[i].idBook));
                        }

                    }
                    Promise.all(promiseTemp).then(() => {
                        self.updateAllTrailer().then(() => {
                            resolve();
                        })
                    })
                })

            })
        })
    },

    updateTrailerAndReturn(id, trailerUsed) {
        return new Promise((resolve, reject) => {
            db.Trailer.update({
                trailerUsed: trailerUsed,
                status: 1
            },
                {
                    where: {
                        id: id
                    }
                }).then(() => {
                    db.Trailer.find({
                        where: {
                            id: id
                        }
                    }).then((trailer) => {
                        resolve(trailer);
                    })
                })

        })
    },
    updateTripsAndReturn(trailer) {
        return new Promise((resolve, reject) => {
            db.Trips.update({
                status: true
            },
                {
                    where: {
                        idLine: trailer.idLine,
                        lineStartHour: trailer.startHour
                    }
                }).then(() => {
                    db.Trips.findAll({
                        where: {
                            idLine: trailer.idLine,
                            lineStartHour: trailer.startHour
                        }, include: [
                            {
                                model: db.Book
                            }
                        ]
                    }).then((trips) => {
                        resolve(trips);
                    })
                })
        })
    },

    updateBikeNumber(id, nbrVelo) {
        return new Promise((resolve, reject) => {
            db.Trailer.update({
                nbBike: nbrVelo
            },
                {
                    where: {
                        id: id
                    }
                }).then(() => {
                    resolve();
                })

        })
    },
    updateAllTrailer() {
        return new Promise((resolve, reject) => {
            db.Trailer.findAll({
            }).then((trailers) => {
                var promises = [];
                for (var i in trailers) {
                    var temp = db.Trips.sum('number', {
                        where: {
                            idLine: trailers[i].idLine,
                            lineStartHour: trailers[i].startHour
                        },
                        include: [{ model: db.Book }]
                    })
                    promises.push(temp);
                }
                Promise.all(promises).then((sum) => {
                    var promisesTrailer = []
                    console.log(sum)
                    for (var i in sum) {
                        sum[i] = sum[i] || 0;

                        var temp = [];

                        if (sum[i] == 0) {
                            temp = db.Trailer.destroy({
                                where: {
                                    id: trailers[i].id
                                }
                            })
                        }
                        else {
                            temp = db.Trailer.update({
                                nbBike: sum[i]
                            },
                                {
                                    where: {
                                        id: trailers[i].id
                                    }
                                })
                        }

                        promises.push(temp);
                    }
                    Promise.all(promisesTrailer).then(() => {
                        resolve();
                    })
                })
            })
        })
    },

    checkIsBookIsOk(idBook) {
        return new Promise((resolve, reject) => {
            db.Trips.findAll({
                where: {
                    idBook: idBook
                }
            }).then((trips) => {
                var isOk = true;
                for (var i = 0; i < trips.length; i++) {
                    if (trips[i].status == 0) {
                        isOk = false;
                    }
                }
                if (isOk) {
                    db.Book.find({
                        where: {
                            id: idBook
                        }
                    }).then((book) => {
                        if (!book.status) {
                            db.Book.update({
                                status: true
                            }, {
                                    where: {
                                        id: idBook
                                    }
                                }).then(() => {
                                    db.Trips.find({
                                        where: {
                                            idBook: idBook,
                                            idStartStation: book.idStartStation
                                        },
                                        include: [
                                            {
                                                model: db.Station,
                                                as: 'startStationTrip'
                                            }
                                        ]
                                    }).then((trip) => {
                                        self.sendEmailOk(book.email, trip.startHour, trip.startStationTrip.name).then(() => {
                                            resolve();
                                        })
                                    })

                                })
                        } else {
                            resolve();
                        }
                    })
                } else {
                    resolve();
                }
            })
        })
    },
    destroyBook(idBook) {
        return new Promise((resolve, reject) => {
            db.Book.find({
                where: {
                    id: idBook
                }
            }).then((book) => {
                db.Trips.find({
                    where: {
                        idBook: idBook,
                        idStartStation: book.idStartStation
                    },
                    include: [
                        {
                            model: db.Station,
                            as: 'startStationTrip'
                        }
                    ]
                }).then((trip) => {
                    self.sendEmailKo(book.email, trip.startHour, trip.startStationTrip.name).then(() => {
                        db.Trips.destroy({
                            where: {
                                idBook: idBook
                            }
                        }).then(() => {
                            db.Book.destroy({
                                where: {
                                    id: idBook
                                }
                            }).then(() => {
                                console.log('Max')
                                resolve(-1);
                            })
                        })
                    })
                })
            })
        })
    },

    dontTakeTailer(id) {
        return new Promise((resolve, reject) => {
            self.updateTrailerAndReturn(id, 0).then((trailer) => {
                self.updateTripsAndReturn(trailer).then((trips) => {
                    var promiseTemp = [];
                    var nbVelo = 0;
                    for (var i = 0; i < trips.length; i++) {
                        nbVelo += Number(trips[i].book.number);
                        if (nbVelo <= 6) {
                            // check if book is ok
                            promiseTemp.push(self.checkIsBookIsOk(trips[i].idBook))
                        } else {
                            //remove book
                            nbVelo -= Number(trips[i].book.number);
                            promiseTemp.push(self.destroyBook(trips[i].idBook));
                        }

                    }
                    Promise.all(promiseTemp).then(() => {
                        self.updateAllTrailer().then(() => {
                            resolve();
                        })
                    })
                })
            })
        })
    },

    sendEmailOk(mail, heure, stationStart) {
        return new Promise((resolve, reject) => {
            email.createEmail(mail, "Booking confirmation", `Votre reservation du ${heure} au départ de ${stationStart} a été confirmée`).then(() => {
                resolve();
            })
        })
    },
    sendEmailKo(mail, heure, stationStart) {
        return new Promise((resolve, reject) => {
            email.createEmail(mail, "Booking cancel", "Votre reservation du ${heure} au départ de ${stationStart} a été annulée").then(() => {
                resolve();
            })
        })
    }
}