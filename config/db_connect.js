var db_config = require('./db_config');

var mysql = require('mysql');

var conn = mysql.createConnection(db_config);

conn.connect((err) => {
  if(err) {
    throw err;
  } else {
    console.log('Connect Success!');
  }
});

module.exports = conn;
