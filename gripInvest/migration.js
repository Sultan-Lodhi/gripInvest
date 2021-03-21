const mysql = require('mysql');
const migration = require('mysql-migrations');
const connection = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'sultan',
  password : 'sultan246',
  database : 'gripInvest'
});

migration.init(connection, __dirname + '/migrations', function() {
  console.log("finished running migrations");
});