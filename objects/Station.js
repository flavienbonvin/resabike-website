var station = class Station {

    /**
     * 
     * @param {Number} id 
     * @param {string} name 
     * @param {Number} posX 
     * @param {Number} posY 
     */
    constructor(id, name, posX, posY){
        this.id = id;
        this.name = name;
        this.posX = posX;
        this.posY = posY;
    }
}

module.exports = station;