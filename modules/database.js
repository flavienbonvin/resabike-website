const Sequelize = require('sequelize');
const sequelize = new Sequelize('dbresabike', 'max', 'pass$1234', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
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
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }
})

Station.hasOne(Line, { foreignKey: 'idEndStation' })
Station.hasOne(Line, { foreignKey: 'idStartStation' })
Zone.hasOne(Line, { foreignKey: 'idZone' })

var Book = sequelize.define('book', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: Sequelize.STRING,
    email: Sequelize.STRING,
    number: Sequelize.INTEGER,
    token: Sequelize.TEXT
});

Station.hasOne(Book, { foreignKey: 'idStartStation' });
Station.hasOne(Book, { foreignKey: 'idEndStation' });


var User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: Sequelize.STRING,
    password: Sequelize.TEXT,
    email: Sequelize.STRING,
    changePass: Sequelize.BOOLEAN
})
Zone.hasOne(User, { foreignKey: 'idZone' })
Role.hasOne(User, { foreignKey: 'idRole' })

var LineStation = sequelize.define('linestation', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nbrOnLine: Sequelize.INTEGER
})

Line.hasOne(LineStation, { foreignKey: 'idLine' })
Station.hasOne(LineStation, { foreignKey: 'idStation' })

var Trips = sequelize.define('trips', {
    idTrips: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    startHour: Sequelize.DATE,
})

Line.hasOne(Trips,{foreignKey:'idLine'})
Book.hasOne(Trips,{foreignKey:'idBook'})
Station.hasOne(Trips,{foreignKey:'idStartStation'})
Station.hasOne(Trips,{foreignKey:'idEndStation'})

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
    LineStation
}