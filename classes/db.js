var dbclass = function(mysql) {
    this.db = mysql.createPool({
        connectionLimit : 100,
        host : 'localhost',
        user : 'itiv',
        password : 'itiv5',
        database : 'itiv',
        debug : true
    });
}
dbclass.prototype.query = function (queryString, input, cb) {
    this.db.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            console.log('Problem med å koble til databasen.');
            return;
        }
        connection.query(queryString, input, function(err, rows) {
            connection.release();
            if(!err) {
                cb(rows);
            }
        });
    });
}
module.exports = dbclass;
