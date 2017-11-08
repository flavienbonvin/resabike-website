var db = require('../database');
var email = require('../email');
const maxBikeWithTrailer = 20;

var self = module.exports = {

    /**
     * Get all trailers from the database that have a 0 status (meaning they have to be managed) 
     */
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

    /**
     * Handle action if zone admin or system admin allow the use of a trailer in a given line at a given time
     * 
     * @param {Number} id 
     */
    takeTrailer(id) {
        return new Promise((resolve, reject) => {
            self.updateTrailerAndReturn(id, 1).then((trailer) => {
                self.updateTripsAndReturn(trailer).then((trips) => {
                    var promiseTemp = [];
                    var nbVelo = 0;
                    for (var i = 0; i < trips.length; i++) {
                        
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

    /**
     * Change the status of a given trailer (trailerUsed) to 1 (1=handled, 0=to handle)
     * 
     * @param {Number} id 
     * @param {Number} trailerUsed 
     */
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

    /**
     * Update the trip where the trailer was given, puts the status of the trip to true 
     * 
     * @param {Trailer} trailer 
     */
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

    /**
     * Update the number of bike of a trailer tu the number of bikes given in parameters
     * 
     * @param {Number} id 
     * @param {Number} nbrVelo 
     */
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

    /**
     * Update all bike number of all the trailers in the db, if there is no bikes, the trailer is deleted
     */
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

    /**
     * Check if books are ok, if they are, send a OK email
     * 
     * @param {Number} idBook 
     */
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
                                        self.sendEmailOk(book.email, trip.startHour, trip.startStationTrip.name, book.pseudo).then(() => {
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

    /**
     * Destroy trips and when a trailer isn't givent to a given line, send a ko email
     * 
     * @param {Number} idBook 
     */
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
                    self.sendEmailKo(book.email, trip.startHour, trip.startStationTrip.name, book.pseudo).then(() => {
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
                                
                                resolve(-1);
                            })
                        })
                    })
                })
            })
        })
    },

    /**
     * Handle action if zone admin or system admin don't allow the use of a trailer in a given line at a given time
     * 
     * @param {Number} id 
     */
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

    /**
     * Send a email to the mail adress to confirm the booking
     * 
     * @param {String} mail 
     * @param {String} heure 
     * @param {String} stationStart 
     */
    sendEmailOk(mail, heure, stationStart, name) {
        return new Promise((resolve, reject) => {
            email.createEmail(mail, "Booking confirmation", `${name}, Your reservation of the ${self.transformDate(heure)} going from ${stationStart} is confirmed`).then(() => {
                resolve();
            })
        })
    },    
    
    /**
     * Send a email to the mail adress to say that the booking isn't OK
     * 
     * @param {String} mail 
     * @param {String} heure 
     * @param {String} stationStart 
     */
    sendEmailKo(mail, heure, stationStart, name) {
        return new Promise((resolve, reject) => {
            email.createEmail(mail, "Booking cancel", `${name}, Your reservation of the ${self.transformDate(heure)} going from ${stationStart} is cancelled`).then(() => {
                resolve();
            })
        })
    },
    /**
     * Transform date to readable date
     * @param {Date} heure 
     */
    transformDate(heure){
        return heure.getDate()+'.'+heure.getMonth()+'.'+heure.getFullYear()+" "+heure.getHours()+":"+heure.getMinutes();
    }
}