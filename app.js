var express = require('express');
var app = express();

//Module
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var config_db = require('./config/db_config');
var sessionStore = new MySQLStore(config_db);
require('express-dynamic-helpers-patch')(app);
//Router
var board = require('./router/board.js');
var member = require('./router/member');

app.dynamicHelpers({
  session: (req, res) => {
    return req.session;
  },
  req: (req, res) => {
    return req;
  }
});
//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '123124SDFSDFJ@#$%@#)FJ!@#asd',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

app.use('/board', board);
app.use('/member', member);

app.set('view engine', 'jade');
app.set('views', './views');

app.listen(3000, () => {
  console.log('Start! 3000');
});

app.locals.pretty= true;
