
/**
 * Module dependencies.
 */
require('dotenv').config();

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , sonyBravia = require('./routes/incoming/sonyBravia')
  , bose = require('./routes/incoming/boseSoundtouch')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , errorHandler = require('express-error-handler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use('/sony-bravia', sonyBravia);
app.use('/bose', bose);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
