var express = require('express')
  , assert = require('assert')
  , pg = require('pg')
  , connConfig = { user: 'postgres', password: 'P@ssword', database: 'rp', host: 'localhost', port: '5432'}
  , client
  , app = express();

app.configure(function(){
//  app.use('/media', express.static(__dirname + '/media'));
  app.use(express.static(__dirname + '/'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

client = new pg.Client(connConfig);
client.connect();


app.get('/stories/:storyId', function(req, res) {
  client.query({
      text: 'select * from stories where id = $1'
      , values: [req.params.storyId]
    }

    , function(err, result) {
      assert.equal(null, err);

      res.json(result.rows.length > 0 ? result.rows[0] : {});
    }
  );
});

app.get('/stories', function(req, res) {
  client.query('select * from stories', function(err, result) {
    assert.equal(null, err);

    res.json(result.rows);
  });
});


app.listen(3000);
console.log('Listening on port 3000');