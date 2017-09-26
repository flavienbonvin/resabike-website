var Station = require('../objects/Station');

const connection = require('../modules/conn').getConnection();
connection.connect();

var StationDB = module.exports = {
    /**
     * Permet d'ajouter une reservation à la base de données
     * @param {Station} station
     * @return {Promise<Station>}
     */
    add(station) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO `station`(`name`, `posX`, `posY`) VALUES (?, ?, ?)',
                [station.name, station.posX, station.posY],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    station.id = results.insertId
                    resolve(station);
                }
            );
        })
    },
    /**
     * Permet d'ajouter plusieurs reservation
     * @param {Station[]} station 
     * @return {Promise<Station[]>}
     */
    addMultiple(station) {
        return new Promise((resolve, reject) => {
            var tab = []
            for (var i = 0; i < station.length; i++){
                tab.push(StationDB.add(station[i]));
            }
            Promise.all(tab).then((res) =>{
                resolve(res);
            })
        })
    },
    /**
     * Permet de supprimer une reservation de la base de données
     * @param {Number} id 
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM station WHERE id = ?', [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            })
        })
    },
    /**
     * Permet de lister tous les éléments présents dans la base de données
     * @return {Promise<Station[]>}
     */
    getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM station', [], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var res = [];
                for (var i = 0; i < results.length; i++) {
                    var current = results[i];
                    var temp = new Station(current.id, current.name, current.posX, current.posY);
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
            connection.query("SELECT * FROM station WHERE id=?", [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var current = results[0];
                var temp = new Station(current.id, current.name, current.posX, current.posY);
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