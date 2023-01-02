let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_express_mysql',
});

connection.connect(function(err) {
    if (!!err) {
        console.log(err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = connection;