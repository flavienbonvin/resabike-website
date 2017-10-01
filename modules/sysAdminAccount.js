var User = require('../objects/User');

var database = require('../modules/database');


module.exports = {

    /**
     * Add a driver to the DB
     * 
     * @param {string} pseudo 
     * @param {string} password 
     * @param {string} email 
     * @param {boolean} changePass 
     * @param {Number} idZone 
     */
    createDriver(pseudo, password, email, changePass, idZone) {
        return new Promise((resolve, reject) => {
            //TODO: Je sais pas si il faut tester si les paramètres doiuvent être non nuls
            //if (pseudo != null && password != null && email != null && changepass != null && idZone != null){
            var user = new User(null, 1, pseudo, password, email, changePass, idZone);

            //TODO: extraire ça dans une autre méthode vu que c'est à chaque fois pareil
            database.User.find({
                where: {
                    pseudo: user.pseudo,
                    email: user.email,
                    idZone: user.idZone,
                    idRole: user.idRole
                }
            }).then((userTemp) => {
                if (userTemp == null) {
                    console.log(user)
                    database.User.create(user.convertToSequelize()).then(() => {
                        resolve();
                    });
                } else {
                    reject("User already in the DB")
                }
            })
        })
    },

    /**
     * Add a zone admin to the DB
     * 
     * @param {string} pseudo 
     * @param {string} password 
     * @param {string} email 
     * @param {boolean} changePass 
     * @param {Number} idZone 
     */
    createZoneAdmin(pseudo, password, email, changePass, idZone) {
        return new Promise((resolve, reject) => {
            var user = new User(null, 2, pseudo, password, email, changePass, idZone);

            user.convertToSequelize();

            database.User.find({
                where: {
                    pseudo: user.pseudo,
                    email: user.email,
                    idZone: user.idZone,
                    idRole: user.idRole
                }
            }).then((userTemp) => {
                if (userTemp == null) {
                    console.log(user)
                    database.User.create(user).then(() => {
                        resolve();
                    });
                } else {
                    reject("User already in the DB")
                }
            })
        })
    },

    /**
     * Add a system to the DB 
     * 
     * @param {string} pseudo 
     * @param {string} password 
     * @param {string} email 
     * @param {boolean} changePass 
     * @param {Number} idZone 
     */
    createSystemAdmin(pseudo, password, email, changePass, idZone) {
        return new Promise((resolve, reject) => {
            var user = new User(null, 3, pseudo, password, email, changePass, idZone);

            user.convertToSequelize();

            database.User.find({
                where: {
                    pseudo: user.pseudo,
                    email: user.email,
                    idZone: user.idZone,
                    idRole: user.idRole
                }
            }).then((userTemp) => {
                if (userTemp == null) {
                    console.log(user)
                    database.User.create(user).then(() => {
                        resolve();
                    });
                } else {
                    reject("User already in the DB")
                }
            })
        })
    },

    /**
     * Get all zones of the database
     */
    retriveAllZones() {
        return new Promise((resolve, reject) => {
            database.Zone.findAll().then((zoneList) => {
                resolve(zoneList)
            });
        })
    }
}