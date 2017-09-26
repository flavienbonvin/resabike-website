var user = class User {

    /**
     * 
     * @param {Number} id 
     * @param {Number} idRole 
     * @param {string} pseudo 
     * @param {string} password 
     * @param {string} email 
     * @param {boolean} changePass 
     * @param {Number} idZone 
     */
    constructor(id, idRole, pseudo, password, email, changePass, idZone){
        this.id = id;;
        this.idRole = idRole;
        this.pseudo = pseudo;
        this.password = password;
        this.email = email;
        this.changePass = changePass;
        this.idRole = idZone;
    }
}

module.exports = user