var Zone = require('../objects/Zone');

const connection = require('../modules/conn').getConnection();
connection.connect();

var ZoneDB = module.exports = {
    /**
     * Permet d'ajouter unu zone à la base de données
     * @param {Zone} zone
     * @return {Promise<Zone>}
     */
    add(zone) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO `zone`(`name`) VALUES (?)',
                [zone.name],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    zone.id = results.insertId
                    resolve(zone);
                }
            );
        })
    },
    /**
     * Permet d'ajouter plusieurs zone
     * @param {Zone[]} zone 
     * @return {Promise<Zone[]>}
     */
    addMultiple(zone) {
        return new Promise((resolve, reject) => {
            var tab = []
            for (var i = 0; i < zone.length; i++){
                tab.push(ZoneDB.add(zone[i]));
            }
            Promise.all(tab).then((res) =>{
                resolve(res);
            })
        })
    },
    /**
     * Permet de supprimer une zone de la base de données
     * @param {Number} id 
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM zone WHERE id = ?', [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            })
        })
    },
    /**
     * Permet de lister tous les éléments présents dans la base de données
     * @return {Promise<Zone[]>}
     */
    getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM zone', [], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var res = [];
                for (var i = 0; i < results.length; i++) {
                    var current = results[i];
                    var temp = new Zone(current.id, current.name);
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
            connection.query("SELECT * FROM zone WHERE id=?", [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var current = results[0];
                var temp = new Zone(current.id, current.name);
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