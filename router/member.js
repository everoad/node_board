var express = require('express');
var router = express.Router();

var memberModel = require('../model/memberModel');

router.route('/join')
.get((req, res) => {
  res.render('member/join');
})
.post((req, res) => {
  var params = Object.keys(req.body).map((key) => {
    return req.body[key];
  });
  memberModel.join(params, (insertId) => {
    if(insertId != 0) {
      console.log('join Success');
    }
    res.redirect('/member/login');
  });
});

router.route('/login')
.get((req, res) => {
  res.render('member/login', { redirect: req.query.redirect });
})
.post((req, res) => {
  var mb_email = req.body.mb_email;
  var mb_pwd = req.body.mb_pwd;
  memberModel.login([mb_email], (rows) => {
    if(!rows) {
      res.render('member/login', { message: '존재하지 않는 이메일입니다.', redirect: req.query.redirect });
    } else if(mb_pwd !== rows.mb_pwd) {
      res.render('member/login', { message: '잘못된 비밀번호입니다.', redirect: req.query.redirect });
    } else {
      req.session.isLogin = true;
      req.session.mb_email = mb_email;
      req.session.mb_nick = rows.mb_nick;
      req.session.mb_id = rows.mb_id;
      req.session.save(function() {
        res.redirect(req.query.redirect);
      });
    }
  });
});

router.get('/logout', (req, res) => {
  delete req.session.isLogin;
  delete req.session.mb_email;
  delete req.session.mb_nick;
  delete req.session.mb_id;
  req.session.save(function() {
    res.redirect('/board/list');
  });
});

router.post('/nickCheck', (req, res) => {
  let mb_nick = req.body.mb_nick;
  memberModel.nickCheck([mb_nick], (rows) => {
    if(rows) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});


router.post('/checkEmail', (req, res) => {
  let mb_email = req.body.mb_email;
  memberModel.checkEmail([mb_email] , (rows) => {
    if(rows) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
})

module.exports = router;
