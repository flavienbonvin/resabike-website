var zone = class Zone {

    /**
     * 
     * @param {Number} id 
     * @param {string} name 
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    
    /**
     * Return an object usable by sequelize
     */
    convertToSequelize() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

module.exports = zone;