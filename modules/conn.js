const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'max',
    password: 'pass$1234',
    database: 'dbresabike'
});
module.exports = {
	getConnection : function(){
		return connection;
	}
}