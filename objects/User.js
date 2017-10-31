var user = class User {

    /**
     * 
     * @param {Number} id 
     * @param {Number} idRole 
     * @param {string} pseudo 
     * @param {string} password 
     * @param {string} email
     * @param {Number} idZone 
     */
    constructor(id, idRole, pseudo, password, email, idZone) {
        this.id = id;
        this.idRole = idRole;
        this.pseudo = pseudo;
        this.password = password;
        this.email = email;
        this.idZone = idZone;
    }

    convertToSequelize() {
        return {
            id: this.id,
            idRole: this.idRole,
            pseudo: this.pseudo,
            password: this.password,
            email: this.email,
            idZone: this.idZone
        }
    }
}

module.exports = user