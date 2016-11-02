var conn = require('../config/db_connect');

exports.getTotalDataNum = function(search, callback) {
  var sql = 'SELECT count(*) total FROM board '
          + 'LEFT JOIN member '
          + 'ON board.bd_author = member.mb_id ';

  if(search[0] && search[1]) {
    sql = attachSearchSql(sql, search);
  }
  conn.query(sql, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows[0].total);
  });
}

exports.getList = function(search, params, callback) {
  var sql = 'SELECT bd_id, bd_title, mb_nick, date_format(bd_wdate, "%Y-%c-%e") bd_wdate '
          + 'FROM board '
          + 'LEFT JOIN member '
          + 'ON board.bd_author = member.mb_id ';

  if(search[0] && search[1]) {
    sql = attachSearchSql(sql, search);
  }
  sql += 'ORDER BY bd_id LIMIT ?, ?';
  conn.query(sql, params, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows);
  });
}

exports.write = function(params, callback) {
  var sql = 'INSERT INTO board(bd_title, bd_content, bd_author, bd_wdate) VALUES (?, ?, ?, now())';
  conn.query(sql, params, (err, result) => {
    if(err) { throw err; }
    callback(result.insertId);
  });
}

exports.getView = function(params, callback) {
  var sql = 'SELECT bd_id, bd_title, bd_content, mb_nick, mb_id, date_format(bd_wdate, "%Y-%c-%e") bd_wdate '
          + 'FROM board '
          + 'LEFT JOIN member '
          + 'ON board.bd_author = member.mb_id '
          + 'WHERE bd_id = ?';

  conn.query(sql, params, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows[0]);
  });
}

exports.delete = function(params, callback) {
  var sql ='DELETE FROM board WHERE bd_id = ?';
  conn.query(sql, params, (err, result) => {
    callback(result.affectedRows);
  });
}

exports.edit = function(params, callback) {
  var sql = 'UPDATE board SET bd_title = ?, bd_content = ? WHERE bd_id = ?';
  conn.query(sql, params, (err, result) => {
    callback(result.changedRows);
  });
}

exports.getComment = function(params, callback) {
  var sql = 'SELECT cmt_id, cmt_content, mb_nick, mb_id, date_format(cmt_wdate, "%Y-%c-%e") cmt_wdate '
          + 'FROM comment '
          + 'LEFT JOIN member '
          + 'ON comment.cmt_author = member.mb_id '
          + 'WHERE bd_id = ? '
          + 'ORDER BY cmt_id DESC';

  conn.query(sql, params, (err, rows, fields) => {
    if(err) { throw err; }
    callback(rows);
  });
}

exports.writeComment = function(params, callback) {
  var sql = 'INSERT INTO comment(cmt_content, cmt_author, bd_id, cmt_wdate) VALUES (?, ?, ?, now())';
  conn.query(sql, params, (err, result) => {
    if(err) { throw err; }
    callback(result.insertId);
  });
}

exports.deleteComment = function(params, callback) {
  var sql = 'DELETE FROM comment WHERE cmt_id = ?';
  conn.query(sql, params, (err, result) => {
    if(err) { throw err; }
    callback(result.affectedRows);
  });
}


function attachSearchSql(sql, search) {
  sql += "WHERE " + search[0] + " LIKE '%" + search[1] + "%' ";
  return sql;
}
