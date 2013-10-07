var express = require('express')
  , assert = require('assert')
  , sql = require('sql')
  , pg = require('pg')
  , connConfig = { user: 'postgres', password: 'P@ssword', database: 'rp', host: 'localhost', port: '5432'}
  , client
  , tblTeams
  , tblStories
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
// DB connection
//

client = new pg.Client(connConfig);
client.connect();


//
// Table definitions
//

tblTeams = sql.define({
  name: 'teams', 
  columns: [
    'id', 
    'name', 
    {
      name: 'product_owner', 
      property: 'po'
    }, 
    {
      name: 'scrum_master', 
      property: 'sm'
    }
  ]
});

tblStories = sql.define({
  name: 'stories', 
  columns: [
    'id', 
    {
      name: 'team_id', 
      property: 'teamId'
    }, 
    {
      name: 'initiative_id', 
      property: 'initiativeId'
    },
    'name', 
    'owner', 
    'release', 
    'notes'
  ]
});

//
// Routes
//

app.get('/stories/:storyId', function(req, res) {
  var q = tblStories
    .select(tblStories.star())
    .from(tblStories)
    .where(tblStories.id.equals(req.params.storyId))
    .toQuery();

  console.log(q);

  client.query(q, function(err, result) {
      assert.equal(null, err);

      res.json(result.rows.length > 0 ? result.rows[0] : {});
    }
  );
});


app.get('/stories', function(req, res) {
  var group = req.param('group')
    , by = req.param('by')
    , q;

  if (group && by) {
    if ('team' === by) {

      q = tblTeams
        .select(
          tblTeams.id.as('teamId'), 
          tblTeams.name.as('teamName'),
          tblTeams.po, 
          tblTeams.sm, 
          tblStories.id.as('storyId'), 
          tblStories.name.as('storyName'), 
          tblStories.initiativeId, 
          tblStories.owner, 
          tblStories.release,
          tblStories.notes
        )
        .from(
          tblTeams.leftJoin(tblStories)
            .on(tblTeams.id.equals(tblStories.teamId)))
        .toQuery();

      console.log(q);

      client.query(q, function(err, result) {
        assert.equal(null, err);

        res.json(result.rows);
      });
    }
    else if ('initiative' === by) {
      //
    }
  }
  else {

    q = tblStories
      .select(tblStories.star())
      .from(tblStories)
      .toQuery();

    console.log(q);

    client.query(q, function(err, result) {
      assert.equal(null, err);

      res.json(result.rows);
    });
  }
});

//
// Start listening
//

app.listen(3000);
console.log('Listening on port 3000');