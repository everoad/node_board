var conn = require('../config/db_connect');

exports.join = function(params, callback) {
  var sql = 'INSERT INTO member(mb_email, mb_nick, mb_pwd, mb_jdate) VALUES (?, ?, ?, now())';
  conn.query(sql, params, (err, result) => {
    if(err) { throw err; }
    callback(result.insertId);
  });
}

exports.login = function(params, callback) {
  var sql = 'SELECT * FROM member WHERE mb_email = ?';
  conn.query(sql, params, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows[0]);
  });
}
