var line = class Line {

    /**
     * 
     * @param {String} id 
     * @param {Number} idStartStation 
     * @param {Number} idEndStation 
     * @param {Number} idZone 
     */
    constructor(id, idStartStation, idEndStation, idZone) {
        this.id = id;
        this.idStartStation = idStartStation;
        this.idEndStation = idEndStation;
        this.idZone = idZone;
    }
    
    /**
    * Return an object usable by sequelize
    */
    convertToSequelize() {
        return {
            id: this.id,
            idStartStation: this.idStartStation,
            idEndStation: this.idEndStation,
            idZone: this.idZone
        }
    }
}

module.exports = line;