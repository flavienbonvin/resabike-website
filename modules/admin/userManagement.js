var User = require('../../objects/User');
var database = require('../database');
const sha256 = require('sha256');


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
            
            var user = new User(body.idUser, body.role, body.username, sha256(body.password), body.email, resetPass, body.zoneDropdown);
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
                        }).catch((res) => {zoneDropdown
                            reject(res);
                        })
                    break;
            }
        })
    },

    /**
     * Add a bus driver to the DB
     * 
     * @param {User} user 
     */
    createDriver(user) {
        return new Promise((resolve, reject) => {
            self.addUserToSystem(user).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        })
    },

    /**
     * Add a zone admin to the DB
     * 
     * @param {User} user 
     */
    createZoneAdmin(user) {
        return new Promise((resolve, reject) => {
            self.addUserToSystem(user).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        })
    },

    /**
     * Add a system to the DB 
     * 
     * @param {User} user
     */
    createSystemAdmin(user) {
        return new Promise((resolve, reject) => {
            self.addUserToSystem(user).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        })
    }, 

    /**
     * Insert the user passed in parameters in the DB
     * 
     * @param {User} user 
     */
    addUserToSystem(user){
        return new Promise((resolve, reject) => {
            database.User.update
            database.User.find({
                where: {
                    id: user.id
                }
            }).then((userTemp) => {
                if (userTemp == null) {
                    console.log("Creating a new user");
                    console.log(user);
                    database.User.create(user.convertToSequelize()).then(() => {
                        resolve();
                    });
                } else {
                    console.log("Updating a user");
                    console.log(user)
                    database.User.update({
                        pseudo: user.pseudo,
                        password: user.password,
                        email: user.email,
                        changePass: user.changePass,
                        idZone: user.idZone,
                        idRole: user.idRole    
                    }, {
                        where: {
                            id: user.id
                        }
                    }).then(() => {
                        resolve();
                    })
                }
            })
        })
    },
        /**
     * Delete a zone
     * @param {string} body 
     */
    deleteUser(body) {
        return new Promise((resolve, reject) => {
            database.User.destroy({
                where: {
                    id: body.idToDel
                }
            }).then((userTemp) => {
                resolve();
            }).catch((error) => {
                reject(error);
            })
        })
    },
    resetPassword(body) {
        return new Promise((resolve, reset) => {
            database.User.update( {
                changePass: 1
            }, {
                where: {
                    id: body.idToEdit
                }
            }).then((userTemp) => {
                resolve();
            }).catch((error) => {
                reject(error);
            })
        })
    },
    getUser(idSearch){
        return new Promise((resolve, reset) => {
            database.User.findById(idSearch).then((userTemp) => {
                resolve(userTemp);
            }).catch((error) => {
                reject(error);
            })
        })
    }
}