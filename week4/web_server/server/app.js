var express = require('express');
var path = require('path');
const winston = require('winston')

var index = require('./routes/index');
var news = require('./routes/news');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/build'));
app.set('view engine', 'jade');

app.use('/static',express.static(path.join(__dirname, '../client/build/static')));

app.use('/', index);
app.use('/news', news);


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  })


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
