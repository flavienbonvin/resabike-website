var Line = require('../objects/Line');

const connection = require('../modules/conn').getConnection();
connection.connect();

var LineDB = module.exports =  {
    /**
     * Permet d'ajouter une ligne à la base de données
     * @param {Line} line 
     * @returns {Promise<Line>}
     */
    add(line){
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO `line`(`idStartStation`, `idEndStation`, `idZone`) VALUES (?, ?, ?)',
                [line.idStartStation, line.idEndStation, line.idZone], 
                function(error, results, fileds){
                    if (error){
                        return reject(error)
                    }
                    line.id = results.insertId
                    resolve(line)
                }
            )
        })
    },
    /**
     * Permet d'ajouter plusieurs lignes
     * @param {Lines[]} lines
     * @returns {Promise<Line[]} 
     */
    addMultiple(lines){
        return new Promise((resolve, reject) => {
            var tab = []
            for (var i = 0; i < lines.length; i++){
                tab.push(LineDB.add(lines[i]))
            }
            Promise.all(tab).then((res) =>{
                resolve(res);
            })
        })
    },
    /**
     * Permet de supprimer une ligne de la base de données
     * @param {Number} id 
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM line WHERE id = ?', [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            })
        })
    },

    /**
     * 
     * @param {Promise<Line[]>}
     */
    getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM line' [], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var res = [];
                for (var i = 0; i < results.length; i++){
                    var current = results[i];
                    var temp = new Line(current.id, current.idStartStation, current.idEndStation, current.idZone);
                    res.push(temp);
                }
                resolve(res);
            })
        })
    }, 
    /**
     * Permet d'obtenir un élément unique de la base de données
     * @param {Number} id 
     */
    get(id){
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM line WHERE id = ?", [id], (error, results, fields) => {
                if (error){
                    return reject(error)
                }
                var current = results[0];
                var temp = new Line(current.id, current.idStartStation, current.idEndStation, current.idZone);
                resolve(temp);
            })
        })
    },
    /**
     * Permet de clore la liaison avec la base de données
     */
    close(){
        connection.end();
    }
}
