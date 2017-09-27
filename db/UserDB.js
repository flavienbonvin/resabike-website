var User = require('../objects/User');

const connection = require('../modules/conn').getConnection();
connection.connect();

var UserDB = module.exports = {
    /**
     * Permet d'ajouter un user à la base de données
     * @param {User} user
     * @return {Promise<User>}
     */
    add(user) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO `user`(`idRole`, `pseudo`, `password`, `email`, `changePass`, `idZone`) VALUES (?, ?, ?, ?, ?, ?)',
                [user.idRole, user.pseudo, user.password, user.email, user.changePass, user.idZone],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    user.id = results.insertId
                    resolve(user);
                }
            );
        })
    },
    /**
     * Permet d'ajouter plusieurs user
     * @param {User[]} user 
     * @return {Promise<User[]>}
     */
    addMultiple(user) {
        return new Promise((resolve, reject) => {
            var tab = []
            for (var i = 0; i < user.length; i++) {
                tab.push(UserDB.add(user[i]));
            }
            Promise.all(tab).then((res) => {
                resolve(res);
            })
        })
    },
    /**
     * Permet de supprimer un user de la base de données
     * @param {Number} id 
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM user WHERE id = ?', [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            })
        })
    },
    /**
     * Permet de lister tous les éléments présents dans la base de données
     * @return {Promise<User[]>}
     */
    getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM user', [], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var res = [];
                for (var i = 0; i < results.length; i++) {
                    var current = results[i];
                    var temp = new User(current.id, current.idRole, current.pseudo, current.password, current.email, current.changePass, current.idZone);
                    res.push(temp);
                }
                resolve(res);
            })
        });
    },
    /**
     * Permet d'obtenir un élément unique de la base de données
     * @param {Number} id 
     */
    get(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM user WHERE id=?", [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var current = results[0];
                var temp = new User(current.id, current.idRole, current.pseudo, current.password, current.email, current.changePass, current.idZone);              
                resolve(temp);
            })
        })
    },
    /**
     * Permet de clore la liaison avec la base de données
     */
    close() {
        connection.end();
    }
}