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
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    idStartStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id',
        }
    },
    idEndStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id',
        }
    }
    /*idZone: {
        type: Sequelize.INTEGER,
        references: {
            model: Zone,
            key: 'id',
        }
    }*/
})

Zone.hasOne(Line,{foreignKey:'idZone'})

var Book = sequelize.define('book', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: Sequelize.STRING,
    email: Sequelize.STRING,
    number: Sequelize.INTEGER,
    token: Sequelize.TEXT,
    idStartStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id',
        }
    },
    idEndStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id',
        }
    }
});



var User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    pseudo: Sequelize.STRING,
    password: Sequelize.TEXT,
    email: Sequelize.STRING,
    changePass: Sequelize.BOOLEAN,
    idZone: {
        type: Sequelize.INTEGER,
        references: {
            model: Zone,
            key: 'id',
        }
    },
    idRole: {
        type: Sequelize.INTEGER,
        references: {
            model: Role,
            key: 'id',
        }
    }
})

var LineStation = sequelize.define('linestation', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    idLine: {
        type: Sequelize.INTEGER,
        references: {
            model: Line,
            key: 'id',
        }        
    },
    idStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id',
        }
    },
    nbrOnLine: Sequelize.INTEGER
})

var Trips = sequelize.define('trips', {
    idLine: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: Line,
            key: 'id'
        }
    },
    idBook: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: Book,
            key: 'id'
        }
    },
    idStartStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id'
        }
    },
    idEndStation: {
        type: Sequelize.INTEGER,
        references: {
            model: Station,
            key: 'id'
        }
    },
    startHour: Sequelize.DATE,
})

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