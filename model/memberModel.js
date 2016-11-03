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


exports.nickCheck = function(params, callback) {
  var sql = 'SELECT mb_id FROM member WHERE mb_nick = ?';
  conn.query(sql, params, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows[0]);
  });
}

exports.checkEmail = function(params, callback) {
  var sql = 'SELECT mb_id FROM member WHERE mb_email = ?';
  conn.query(sql, params, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows[0]);
  });
}
