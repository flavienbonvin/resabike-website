const db = require('../database');
const sha256 = require('sha256');

var self = module.exports = {

    /**
     * Logs a user 
     * 
     * @param {Object} body 
     * @param {String} session 
     */
    login(body, session) {
        return new Promise((resolve, reject) => {
            db.User.find({
                where: {
                    pseudo: body.pseudo,
                    password: sha256(body.password)
                }
            }).then((personne) => {
                if (personne==null){
                    reject();
                }else{
                    session.isConnected = true;
                    session.userInfo = personne;
                    resolve();
                }
            })
        })
    },
    logout(session){
        session.isConnected = false;
    }
}