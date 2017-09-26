var line = class Line {
    
    /**
     * 
     * @param {Number} id 
     * @param {Number} idStartStation 
     * @param {Number} idEndStation 
     * @param {Number} idZone 
     */
    constructor(id, idStartStation, idEndStation, idZone){
        this.id = id;
        this.idStartStation = idStartStation;
        this.idEndStation = idEndStation;
        this.idZone = idZone;
    }
}

module.exports = line;