var trailer = class Trailer {

    /**
     * 
     * @param {Number} id 
     * @param {Date} startHour 
     * @param {Number} nbBike 
     * @param {Boolean} trailerUsed 
     * @param {Boolean} status 
     * @param {Number} idLine 
     */
    constructor(id, startHour, nbBike, trailerUsed, status, idLine) {
        this.id = id;
        this.startHour = startHour;
        this.nbBike = nbBike;
        this.trailerUsed = trailerUsed;
        this.status = status;
        this.idLine = idLine;
    }

    convertToSequelize() {
        return {
            id: this.id,
            startHour: this.startHour,
            nbBike: this.nbBike,
            trailerUsed: this.trailerUsed,
            status: this.status,
            idLine: this.idLine
        }
    }
}

module.exports = trailer;