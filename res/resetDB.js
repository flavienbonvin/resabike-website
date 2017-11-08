var db = require('../modules/database');
var Role = require('../objects/Role');
var Zone = require('../objects/Zone');
var Station = require('../objects/Station');
var Line = require('../objects/Line');
var User = require('../objects/User');
var Book = require('../objects/Book');
var Trip = require('../objects/Trip');
var sha256 = require('sha256');
var roles = [];
var zones = [];
var users = [];
var books = [];
var trips = [];
var date = new Date();
var LineManagement = require('../modules/admin/lineManagement');
var ConnectionManagement = require('../modules/client/connectionManagement');
var BookManagement = require('../modules/client/bookManagement');


roles.push(
    new Role(1, 'Bus driver').convertToSequelize(),
    new Role(2, 'Zone admin').convertToSequelize(),
    new Role(3, 'System admin').convertToSequelize());

zones.push(
    new Zone(1, 'Anniviers').convertToSequelize(),
    new Zone(2, 'Hérens').convertToSequelize());

users.push(
    new User(1, 1, 'Flavien', sha256('123456'), 'test.test@test.test', 1).convertToSequelize(),
    new User(2, 2, 'Maxime', sha256('testPassword'), 'test@test.ch', 1).convertToSequelize(),
    new User(3, 3, 'Hugo', sha256('passwordHugo'), 'hugo@resabike.ch', null).convertToSequelize(),
    new User(4, 3, 'root', sha256('root'), 'hugo@resabike.ch', null).convertToSequelize()
)


db.sync().then(() => {

    db.Role.bulkCreate(roles).then(() => {
        db.Zone.bulkCreate(zones).then(() => {
            db.User.bulkCreate(users).then(() => {
                var body = {
                    departFinal: 'Sierre, poste/gare',
                    arriveeFinal: 'Vissoie, poste',
                    zoneFinal: 1
                }
                LineManagement.prepareStation(body).then(() => {
                    var body = {
                        departFinal: 'Vissoie, poste',
                        arriveeFinal: 'Zinal, village de vacances',
                        zoneFinal: 1
                    }
                    LineManagement.prepareStation(body).then(() => {
                        var body = {
                            departFinal: 'Sion, poste/gare',
                            arriveeFinal: 'Les Haudères, poste',
                            zoneFinal: 2
                        }
                        LineManagement.prepareStation(body).then(() => {
                            db.Book.bulkCreate(books).then(() => {
                                db.Trips.bulkCreate(trips).then(() => {
                                    createBook(1, 11, 3, 1).then(() => {
                                        createBook(26, 34, 3, 2).then(() => {
                                            createBook(2, 25, 10, 1).then(() => {
                                                createBook(3, 23, 4, 1).then(() => {
                                                    db.close();
                                                })
                                            })
                                        })
                                    })

                                })
                            })
                        });
                    });
                })
            })
        })

    })

});

function createBook(depart, fin, nbBike, zone) {
    return new Promise((resolve, reject) => {
        var today = new Date();
        today.setDate(today.getDate() + 2);
        //28-10-2017, 19:25
        var dateTomorrow = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear() + ", " + today.getHours() + ":" + today.getMinutes();
        var body = {
            date: dateTomorrow,
            depart: depart,
            destination: fin,
            zone: zone
        }
        ConnectionManagement.getConnectionForTrip(body).then((list) => {
            var horaire = list[1][0];
            var body2 = {
                bookPseudo: "max",
                bookEmail: "maxime.betrisey@jehegt.ch",
                bookNumber: nbBike,
                bookIdStartStation: horaire.idStationDeparture,
                bookIdEndStation: horaire.idStationDestination,
                bookIdZone : zone
            }
            var j = 0;
            for (var i = 0; i < horaire.tripsInfo.length; i++) {
                if (horaire.tripsInfo[i].idLine != -1) {
                    body2['depart' + i] = horaire.tripsInfo[i].depart;
                    body2['departTime' + i] = horaire.tripsInfo[i].departTime;
                    body2['sortie' + i] = horaire.tripsInfo[i].sortie;
                    body2['idLine' + i] = horaire.tripsInfo[i].idLine;
                    body2['nbPlaceRestant' + i] = horaire.tripsInfo[i].nbPlaceRestant;
                    j++;
                }

            }
            body2['nbLine'] = j
            if (j > 0) {
                BookManagement.addBook(body2, 'fr').then(() => {
                    resolve();
                })
            } else {
                resolve();
            }
        })
    })
}