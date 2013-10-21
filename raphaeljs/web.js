var express = require('express')
  , app = express();


//
// App config
//

app.configure(function(){
//  app.use('/media', express.static(__dirname + '/media'));
  app.use(express.static(__dirname + '/'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//
// Start listening
//

app.listen(3000);
console.log('Listening on port 3000');