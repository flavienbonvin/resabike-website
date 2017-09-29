/*const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'max',
    password: 'pass$1234',
    database: 'dbresabike'
});
module.exports = {
    getConnection: function () {
        return connection;
    }
}*/
var Sequelize = require('sequelize');
const sequelize = new Sequelize('dbresabike', 'max', 'pass$1234', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

module.exports = {
    init : function(){
        return sequelize;
    },
    sync : function(){
        return new Promise((resolve,reject) => {
            sequelize.sync().then(() => {
                resolve();
            })
        })
        
    }

}