var station = class Station {

    /**
     * 
     * @param {Number} id 
     * @param {string} name 
     * @param {Number} posX 
     * @param {Number} posY 
     */
    constructor(id, name, posX, posY) {
        this.id = id;
        this.name = name;
        this.posX = posX;
        this.posY = posY;
    }

    /**
     * Return an object usable by sequelize
     */
    convertToSequelize() {
        return {
            id: this.id,
            name: this.name,
            posX: this.posX,
            posY: this.posY
        }
    }
}

module.exports = station;