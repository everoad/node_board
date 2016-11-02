var conn = require('../config/db_connect');

exports.uploadIamge = function(params, callback) {
  console.log('haha', params);
  var sql = 'INSERT INTO image(img_name, bd_id) VALUES ?';
  conn.query(sql, [params], (err, results) => {
    if(err) { console.error(err);}
    callback(results);
  });
}

exports.getImageList = function(params, callback) {
  var sql = 'SELECT img_id, img_name FROM image WHERE bd_id = ?';
  conn.query(sql, params, (err, rows, fields) => {
    callback(rows);
  });
}
