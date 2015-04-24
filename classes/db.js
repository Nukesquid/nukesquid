var dbclass = function(mysql) {
    this.db = mysql.createPool({
        connectionLimit : 100,
        host : 'localhost',
        user : 'itiv',
        password : 'itiv5',
        database : 'itiv'
    });
};
dbclass.prototype.query = function (queryString, input, cb) {
    this.db.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            console.log('Problem med å koble til databasen: ' + err);
        } else {
            connection.query(queryString, input, function(err, rows) {
                connection.release();
                if(!err) {
                    if(typeof cb !== 'undefined') {
                        cb(rows);
                    }
                } else {
                    console.log('Problem med spørring til databasen: ' + err + ' ' + queryString);
                }
            });
        }
    });
};
dbclass.prototype.escape = function (escapeString) {
	return this.db.escape(escapeString);
};

module.exports = dbclass;