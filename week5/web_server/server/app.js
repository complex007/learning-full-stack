// var auth = require('./routes/auth');
// var bodyParser = require('body-parser');
// var cors = require('cors');
// var express = require('express');
// var passport = require('passport');
// var path = require('path');

// var index = require('./routes/index');
// var news = require('./routes/news');

// var app = express();

// app.use(bodyParser.json());

// var config = require('./config/config.json');

// require('./models/main').connect(config.mongodbUri);
// var authChecker = require('./auth/auth_checker');

// // load passport strategies.
// app.use(passport.initialize());
// passport.use('local-signup', require('./auth/local_signup_strategy'));
// passport.use('local-login', require('./auth/local_login_strategy'));

// // view engine setup
// app.set('views', path.join(__dirname, '../client/build'));
// app.set('view engine', 'jade');
// app.use('/static', express.static(path.join(__dirname, '../client/build/static')));

// // TODO: remove this after development is done
// app.use(cors());

// app.use('/', index);
// app.use('/auth', auth);
// app.use('/news', authChecker);
// app.use('/news', news);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   res.status(404);
// });

// module.exports = app;



var express = require('express');
var path = require('path');
const winston = require('winston')

var index = require('./routes/index');
var news = require('./routes/news');
var auth = require('./routes/auth');
var bodyParser = require('body-parser');// no http body if don't have this

var app = express();
var mongodb = require('./models/main');
var config = require('./config/config.json');
var cors = require('cors');
var passport = require('passport');
// view engine setup
app.set('views', path.join(__dirname, '../client/build'));
app.set('view engine', 'jade');
app.use(bodyParser.json());

mongodb.connect(config.mongodbUri);

app.use('/static',express.static(path.join(__dirname, '../client/build/static')));
// auth checker must be imported after import mongodb
var authChecker = require('./auth/auth_checker');
// authChecker must use before news
// otherwise, it sends the news firest then do the auth check, which does not make sence

app.use(passport.initialize());
passport.use('local-signup', require('./auth/local_signup_strategy'));
passport.use('local-login', require('./auth/local_login_strategy'));

// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// })
app.use(cors());


app.use('/', index);
app.use('/auth', auth);
app.use('/news', authChecker);
app.use('/news', news);


// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// })
app.use(cors());

// catch 404  
app.use(function(req, res, next) {
  res.status(404);
});

const formatLevels = {
  levels:{ 
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4
  },
  colors:{
    error: 'red', 
    warn: 'red', 
    info: 'red', 
    verbose: 'red', 
    debug: 'red'
  }
};
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ],
  levels:formatLevels.levels
});
winston.addColors(formatLevels.colors);
logger.level = 'debug';
logger.info('Hello world');
logger.debug('Debugging info');
winston.format.combine(
  winston.format.colorize()
);
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = app;
