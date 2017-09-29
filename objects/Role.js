var role = class Role {

    /**
     * 
     * @param {Number} id 
     * @param {string} name 
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    convertToSequelize() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

module.exports = role;