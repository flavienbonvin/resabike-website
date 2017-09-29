var book = class Book {
    /**
     * 
     * @param {Number} id 
     * @param {Number} idLine 
     * @param {Number} idStartStation 
     * @param {Number} idEndStation 
     * @param {string} pseudo 
     * @param {string} email 
     * @param {Number} number 
     * @param {Date} startHour 
     * @param {string} token 
     */

    constructor(id, idLine, idStartStation, idEndStation, pseudo, email, number, startHour, token) {
        this.id = id;
        this.idLine = idLine;
        this.idStartStation = idStartStation;
        this.idEndStation = idEndStation;
        this.pseudo = pseudo;
        this.email = email;
        this.number = number;
        this.startHour = startHour;
        this.token = token;
    }

    convertToSequelize() {
        return {
            id: this.id,
            idLine: this.idLine,
            idStartStation: this.idStartStation,
            idEndStation: this.idEndStation,
            pseudo: this.pseudo,
            email: this.email,
            number: this.number,
            startHour: this.startHour,
            token: this.token
        }
    }
}

module.exports = book;