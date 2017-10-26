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


roles.push(
    new Role(1, 'Bus driver').convertToSequelize(),
    new Role(2, 'Zone admin').convertToSequelize(),
    new Role(3, 'System admin').convertToSequelize());

zones.push(
    new Zone(1, 'Anniviers').convertToSequelize(),
    new Zone(2, 'Hérens').convertToSequelize());

users.push(
    new User(1, 1, 'Flavien', sha256('123456'), 'test.test@test.test', 0, 1).convertToSequelize(),
    new User(2, 2, 'Maxime', sha256('testPassword'), 'test@test.ch', 0, 1).convertToSequelize(),
    new User(3, 3, 'Hugo', sha256('passwordHugo'), 'hugo@resabike.ch', 0, null).convertToSequelize(),
    new User(4, 3, 'root', sha256('root'), 'hugo@resabike.ch', 0, null).convertToSequelize()
)


books.push(
    new Book(1, 1, 11, 'Flavien', 'bonvin.flavien@gmail.com', 4, 'token1', true).convertToSequelize(),
    new Book(2, 26, 38, 'Maxime', 'max@gmail.com', 3, 'token2', true).convertToSequelize(),
    new Book(3, 1, 24, 'Hugo', 'hugo@hugo.com', 8, 'token3', false).convertToSequelize());

trips.push(
    new Trip(1, date, 451, 1, 1, 11).convertToSequelize(),
    new Trip(2, date, 381, 2, 26, 38).convertToSequelize(),
    new Trip(3, date, 451, 3, 1, 11).convertToSequelize(),
    new Trip(4, date, 453, 3, 11, 24).convertToSequelize());

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
                                    db.close();
                                })
                            })
                        });
                    });
                })
            })
        })

    })

});