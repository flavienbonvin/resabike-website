const database = require('../modules/database');

module.exports = () => {
    return new Promise((resolve, reject) => {
        database.User.findAll().then((userList) => {
            resolve(userList);
        })
    })
}