var express = require('express');
var router = express.Router();
var boardModel = require('../model/boardModel');
var imageModel = require('../model/imageModel');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/node/node_board/public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

router.use(['/write', '/delete', '/edit'], (req, res, next) => {
  if(!req.session.isLogin)
    res.redirect('/member/login?redirect=' + req.originalUrl);
  next();
});

router.get('/list', (req, res) => {
  var index = req.query.index;
  index = (index == null) ? 1 : parseInt(index);

  var stype = req.query.stype;
  var skey = req.query.skey;

  var dataPerPage = 15;
  var start = (index - 1) * dataPerPage;

  boardModel.getTotalDataNum([stype, skey], (totalDataNum) => {
    var totalPage = Math.ceil(totalDataNum / dataPerPage);
    var no = totalDataNum - (1 - index) * totalPage;

    boardModel.getList([stype, skey], [start, dataPerPage], (rows) => {
      res.render('board/list', { list: rows, no: no, index: index });
    });
  });
});

router.route('/write')
.get((req, res) => {
  res.render('board/write');
})
.post(upload.array('photos', 12), (req, res) => {
  var params = Object.keys(req.body).map((key) => {
    return req.body[key];
  });
  params.push(req.session.mb_id);

  boardModel.write(params, (insertId) => {
    var params = req.files.map((file) => {
      return [file.originalname, insertId];
    });
    imageModel.uploadIamge(params, (results) => {
      res.redirect('/board/view?bd_id=' + insertId);
    });
  });
});

router.get('/view/:bd_id', (req, res) => {
  boardModel.getView([req.params.bd_id], (rows) => {
    imageModel.getImageList([req.params.bd_id], (images) => {
      res.render('board/view', { data: rows, images: images });
    });
  });
});

router.get('/delete', (req, res) => {
  boardModel.delete([req.query.bd_id], (affectedRows) => {
    console.log(affectedRows);
    res.redirect('/board/list');
  });
});

router.route('/edit')
.get((req, res) => {
  boardModel.getView([req.query.bd_id], (rows) => {
    res.render('board/edit', { data: rows });
  });
})
.post((req, res) => {
  var params = Object.keys(req.body).map((key) => {
    return req.body[key];
  });
  boardModel.edit(params, (changedRows) => {
    console.log(changedRows);
    res.redirect('/board/view?bd_id=' + req.body.bd_id);
  });
});

router.get('/getComment', (req, res) => {
  console.log('router getComment', req.query.bd_id);
  boardModel.getComment([req.query.bd_id], (rows) => {
    res.send(rows);
  });
});

router.post('/writeComment', (req, res) => {
  var bd_id = req.body.bd_id;
  var cmt_content = req.body.cmt_content;
  var cmt_author = req.session.mb_id;
  boardModel.writeComment([cmt_content, cmt_author, bd_id], (insertId) => {
    console.log(insertId);
    res.redirect('/board/getComment?bd_id=' + bd_id);
  });
});

router.post('/deleteComment', (req, res) => {
  var cmt_id = req.body.cmt_id;
  var bd_id = req.body.bd_id;
  console.log(cmt_id, bd_id);
  boardModel.deleteComment([cmt_id], (afftectedRows) => {
    console.log('affected', afftectedRows);
    res.redirect('/board/getComment?bd_id=' + bd_id);
  });
});

module.exports = router;
