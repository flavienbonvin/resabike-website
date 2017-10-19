var book = class Book {
    /**
     * 
     * @param {Number} id 
     * @param {Number} idStartStation 
     * @param {Number} idEndStation 
     * @param {string} pseudo 
     * @param {string} email 
     * @param {Number} number 
     * @param {string} token 
     * @param {string} status
     */

    constructor(id, idStartStation, idEndStation, pseudo, email, number, token, status) {
        this.id = id;
        this.idStartStation = idStartStation;
        this.idEndStation = idEndStation;
        this.pseudo = pseudo;
        this.email = email;
        this.number = number;
        this.token = token;
        this.status = status;
    }

    convertToSequelize() {
        return {
            id: this.id,
            idStartStation: this.idStartStation,
            idEndStation: this.idEndStation,
            pseudo: this.pseudo,
            email: this.email,
            number: this.number,
            token: this.token,
            status : this.status
        }
    }
}

module.exports = book;