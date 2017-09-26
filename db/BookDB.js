var Book = require('../objects/Book');

const connection = require('../modules/conn').getConnection();
connection.connect();

var BookDB = module.exports = {
    /**
     * Permet d'ajouter une reservation à la base de données
     * @param {Book} book
     * @return {Promise<Book>}
     */
    add(book) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO `book`(`idLine`, `idStartStation`, `idEndStation`, `pseudo`, `email`, `number`, `startHour`, `token`) VALUES (?,?,?,?,?,?,?,?)',
                [book.idLine, book.idStartStation, book.idEndStation, book.pseudo, book.email, book.number, book.startHour, book.token],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    book.id = results.insertId
                    resolve(book);
                }
            );
        })
    },
    /**
     * Permet d'ajouter plusieurs reservation
     * @param {Book[]} books 
     * @return {Promise<Book[]>}
     */
    addMultiple(books) {
        return new Promise((resolve, reject) => {
            var tab = []
            for (var i = 0; i < books.length; i++){
                tab.push(BookDB.add(books[i]));
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
            connection.query('DELETE FROM book WHERE id = ?', [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            })
        })
    },
    /**
     * Permet de lister tous les éléments présents dans la base de données
     * @return {Promise<Book[]>}
     */
    getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM book', [], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var res = [];
                for (var i = 0; i < results.length; i++) {
                    var current = results[i];
                    var temp = new Book(current.id, current.idLine, current.idStartStation, current.idEndStation, current.pseudo, current.email, current.number, current.startHour, current.token);
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
            connection.query("SELECT * FROM book WHERE id=?", [id], (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                var current = results[0];
                var temp = new Book(current.id, current.idLine, current.idStartStation, current.idEndStation, current.pseudo, current.email, current.number, current.startHour, current.token);
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