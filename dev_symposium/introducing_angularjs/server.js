var express = require('express')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , app = express();


//
// App config
//

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser());
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/'));
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


app.listen(app.get('port'));
console.log('Server listening on port ' + app.get('port'));