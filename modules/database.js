const Sequelize = require('sequelize');
const sequelize = new Sequelize('dbresabike', 'max', 'pass$1234', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    timezone: 'Europe/Zurich'
});



var Role = sequelize.define('role', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING
})

var Station = sequelize.define('station', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
    posX: Sequelize.INTEGER,
    posY: Sequelize.INTEGER
})
var Zone = sequelize.define('zone', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING
})

var Line = sequelize.define('line', {
    id: { type: Sequelize.STRING, primaryKey: true }
})

Station.hasOne(Line, { as: 'endStation', foreignKey: 'idEndStation' })
Line.belongsTo(Station, { as: 'endStation', foreignKey: 'idEndStation' })
Station.hasOne(Line, { as: 'startStation', foreignKey: 'idStartStation' })
Line.belongsTo(Station, { as: 'startStation', foreignKey: 'idStartStation' })
Zone.hasMany(Line, { foreignKey: 'idZone' , primaryKey: true})
Line.belongsTo(Zone, { foreignKey: 'idZone' , primaryKey: true})
Line.belongsTo(Zone, { foreignKey: 'idZone' })

var Book = sequelize.define('book', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: Sequelize.STRING,
    email: Sequelize.STRING,
    number: Sequelize.INTEGER,
    token: Sequelize.TEXT,
    status: { type: Sequelize.BOOLEAN, defaultValue: false }
});


Station.hasMany(Book, { as: 'startStationBook', foreignKey: 'idStartStation' });
Book.belongsTo(Station, { as: 'startStationBook', foreignKey: 'idStartStation' });
Station.hasMany(Book, { as: 'endStationBook', foreignKey: 'idEndStation' });
Book.belongsTo(Station, { as: 'endStationBook', foreignKey: 'idEndStation' });


var User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: Sequelize.STRING,
    password: Sequelize.TEXT,
    email: Sequelize.STRING,
    changePass: Sequelize.BOOLEAN
})
Zone.hasMany(User, { foreignKey: 'idZone' })
Role.hasMany(User, { foreignKey: 'idRole' })

var LineStation = sequelize.define('linestation', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nbrOnLine: Sequelize.INTEGER
})

Line.hasMany(LineStation, { foreignKey: 'idLine' })
LineStation.belongsTo(Line, { foreignKey: 'idLine' })
Station.hasMany(LineStation, { foreignKey: 'idStation' })
LineStation.belongsTo(Station, { foreignKey: 'idStation' })

var Trips = sequelize.define('trips', {
    idTrips: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startHour: Sequelize.DATE,
    lineStartHour: Sequelize.DATE,
    status: Sequelize.BOOLEAN
})

Line.hasMany(Trips, { foreignKey: 'idLine' })
Trips.belongsTo(Line, { foreignKey: 'idLine' })
Book.hasMany(Trips, { foreignKey: 'idBook' })
Trips.belongsTo(Book, { foreignKey: 'idBook' })
Station.hasMany(Trips, { as: 'startStationTrip', foreignKey: 'idStartStation' })
Trips.belongsTo(Station, { as: 'startStationTrip', foreignKey: 'idStartStation' })
Station.hasMany(Trips, { as: 'endStationTrip', foreignKey: 'idEndStation' })
Trips.belongsTo(Station, { as: 'endStationTrip', foreignKey: 'idEndStation' })


var Trailer = sequelize.define('trailer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startHour: Sequelize.DATE,
    nbBike: Sequelize.INTEGER,
    trailerUsed: { type: Sequelize.BOOLEAN, defaultValue: false },
    status: { type: Sequelize.BOOLEAN, defaultValue: true }
})

Line.hasMany(Trailer, { foreignKey: 'idLine' })
Trailer.belongsTo(Line, { foreignKey: 'idLine' })


module.exports = {
    sync: function () {
        return new Promise((resolve, reject) => {
            sequelize.sync({ force: true }).then(() => {
                resolve();
            })
        })
    },
    close: function () {
        sequelize.close();
    },
    Role,
    Station,
    Zone,
    Line,
    Book,
    User,
    LineStation,
    Trips,
    Trailer
}