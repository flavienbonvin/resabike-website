var User = require('../../objects/User');
var database = require('../database');


var self = module.exports = {

    /**
    * 
    * @param {User} user 
    */
    createUser(body) {
        return new Promise((resolve, reject) => {
            var resetPass = false;
            if (body.passwordReset) {
              resetPass = true;
            }
            //TODO: add the zone ID, get from dropdown (temporary 1)
            var user = new User(null, body.role, body.username, body.password, body.email, resetPass, 1);
            switch (user.idRole) {
                //Create bus driver 
                case '1':
                    self.createDriver(user)
                        .then(() => {
                            resolve();
                        }).catch((res) => {
                            reject(res);
                        })
                    break;
                //Create zone admin
                case '2':
                    self.createZoneAdmin(user)
                        .then(() => {
                            resolve();
                        }).catch((res) => {
                            reject(res);
                        })
                    break;
                //Create system admin
                case '3':
                    self.createSystemAdmin(user)
                        .then(() => {
                            resolve();
                        }).catch((res) => {
                            reject(res);
                        })
                    break;
            }
        })
    },

    /**
     * 
     * @param {User} user 
     */
    createDriver(user) {
        return new Promise((resolve, reject) => {

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
     * @param {User} user 
     */
    createZoneAdmin(user) {
        return new Promise((resolve, reject) => {

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
     * Add a system to the DB 
     * 
     * @param {User} user
     */
    createSystemAdmin(user) {
        return new Promise((resolve, reject) => {

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
    }
}