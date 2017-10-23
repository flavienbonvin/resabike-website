var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admin = require('./routes/admin');
var driver = require('./routes/driver');
var services = require('./routes/services');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'maCleSecret'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/semantic-ui-calendar/dist')));

app.use((req,res,next) => {
  console.log('url : '+req.url);
  if(req.url=="/"){
    res.redirect("/fr");
    return;
  }else if(req.url.indexOf("/services")!=-1){
    next();
    return;
  }
  var langUrl = req.url.split('/');
  var newUrl = "/";
  for(var i = 2;i<langUrl.length;i++){
    newUrl += langUrl[i]+"/"; 
  }
  if(newUrl.length>1){
    newUrl = newUrl.slice(0,-1);
  }
  
  req.url = newUrl;
  console.log(req.url);
  var lang = require('./lang/'+langUrl[1]+'.js');
  res.locals.langs = lang;
  res.locals.langUsed = langUrl[1];
  next();
})


app.use('/', index);
app.use('/admin', admin);
app.use('/driver', driver);
app.use('/services', services);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
