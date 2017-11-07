var lineStation = class LineStation {

    /**
     * 
     * @param {Number} id 
     * @param {Number} idLine 
     * @param {Number} idStation 
     * @param {Number} nbrOnLine 
     */
    constructor(id, idLine, idStation, nbrOnLine){
        this.id = id;
        this.idLine = idLine;
        this.idStation = idStation;
        this.nbrOnLine = nbrOnLine;
    }

    /**
     * Return an object usable by sequelize
     */
    convertToSequelize(){
        return {
            id: this.id,
            idLine: this.idLine,
            idStation: this.idStation,
            nbrOnLine: this.nbrOnLine
        }
    }

}

module.exports = lineStation;