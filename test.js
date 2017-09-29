var db = require('./modules/database');

db.sync().then(() => {
    db.close();
});