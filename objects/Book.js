//var book = class Book {
/**
 * 
 * @param {Number} id 
 * @param {Number} idLine 
 * @param {Number} idStartStation 
 * @param {Number} idEndStation 
 * @param {string} pseudo 
 * @param {string} email 
 * @param {Number} number 
 * @param {Date} startHour 
 * @param {string} token 
 */
/*constructor(id, idLine, idStartStation, idEndStation, pseudo, email, number, startHour, token) {
    this.id = id;
    this.idLine = idLine;
    this.idStartStation = idStartStation;
    this.idEndStation = idEndStation;
    this.pseudo = pseudo;
    this.email = email;
    this.number = number;
    this.startHour = startHour;
    this.token = token;
}
}*/
var Sequelize = require('sequelize');
var conn = require('../modules/conn');
var sequelize = conn.init();

var Book = sequelize.define('book', {
    id: Sequelize.INTEGER,
    idLine: Sequelize.INTEGER,
    idStartStation: Sequelize.INTEGER,
    idEndStation: Sequelize.INTEGER,
    pseudo: Sequelize.STRING,
    email: Sequelize.STRING,
    number:Sequelize.INTEGER,
    startHour:Sequelize.DATE,
    token:Sequelize.TEXT
});

conn.sync().then(() =>{
    module.exports = conn;
})

