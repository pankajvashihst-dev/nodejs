const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const parseurl = require('parseurl');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const config = require('./config/config');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./config/swagger.json');
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(validator());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
	resave: true,
	saveUninitialized: true
}));
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  if(req.accepts('json')){
  }if(req.accepts('html')){
    
  }
  var pathname = parseurl(req).pathname
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  next()
});


/*
|--------------------------------------------------------------------------
| Application Route file run the server
|--------------------------------------------------------------------------
|
| import the all route 
|
*/

require('./routes/route')(app);
require('./routes/api.route')(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
|--------------------------------------------------------------------------
| Middle ware of the application
|--------------------------------------------------------------------------
|
| import the all route 
|
*/
app.use(function(err, req, res, next) {
  console.log("pankaj vashisht");
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(req.accepts('json')){
    res.status(err.status).json({
      error_message:"page not found",
      code:err.status,
      success:false
    });
  }if(req.accepts('html')){
    
  }
  res.status(err.status || 500);
  res.render('error');
  next();
});


app.listen(config.App_port, (err, resu) =>{
  if(err) throw err;
  console.log('server listening on port '+config.App_port+'....');
});