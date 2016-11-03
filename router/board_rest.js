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

// router.use(['/write', '/delete', '/edit'], (req, res, next) => {
//   if(!req.session.isLogin)
//     res.redirect('/member/login?redirect=' + req.originalUrl);
//   next();
// });

router.get('/', (req, res) => {
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
      res.render('board/list_rest', { list: rows, no: no, index: index });
    });
  });
});

router.get('/write', (req, res) => {
  res.render('board/write_rest');
});

router.get('/edit', (req, res) => {
  boardModel.getView([req.query.bd_id], (rows) => {
    res.render('board/edit_rest', { data: rows });
  });
});

router.get('/:bd_id', (req, res) => {
  boardModel.getView([req.params.bd_id], (rows) => {
    imageModel.getImageList([req.params.bd_id], (images) => {
      res.render('board/view_rest', { data: rows, images: images });
    });
  });
});

router.delete('/:bd_id', (req, res) => {
  boardModel.delete([req.params.bd_id], (affectedRows) => {
    console.log(affectedRows);
    res.redirect('/board/list');
  });
});

router.post('/', upload.array('photos', 12), (req, res) => {
  var params = Object.keys(req.body).map((key) => {
    return req.body[key];
  });
  params.push(req.session.mb_id);

  boardModel.write(params, (insertId) => {
    var params = req.files.map((file) => {
      return [file.originalname, insertId];
    });
    imageModel.uploadIamge(params, (results) => {
      res.redirect('/board/' + insertId);
    });
  });
});

router.put('/:bd_id', (req, res) => {
  var params = Object.keys(req.body).map((key) => {
    return req.body[key];
  });
  params.push(req.params.bd_id);
  boardModel.edit(params, (changedRows) => {
    console.log(changedRows);
    res.redirect('/board/' + req.body.bd_id);
  });
});

//코멘트 리스트 가져오기.
router.get('/:bd_id/comment', (req, res) => {
  boardModel.getComment([req.params.bd_id], (rows) => {
    res.send(rows);
  });
});

//코멘트 쓰기
router.post('/:bd_id/comment', (req, res) => {
  var bd_id = req.params.bd_id;
  var cmt_content = req.body.cmt_content;
  var cmt_author = req.session.mb_id;
  boardModel.writeComment([cmt_content, cmt_author, bd_id], (insertId) => {
    console.log(insertId);
    res.redirect(`/board/${bd_id}/comment`);
  });
});

//코멘트 삭제
router.delete('/:bd_id/comment', (req, res) => {
  var cmt_id = req.body.cmt_id;
  var bd_id = req.params.bd_id;
  boardModel.deleteComment([cmt_id], (affectedRows) => {
    if(affectedRows == 0) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
  });
});


module.exports = router;
