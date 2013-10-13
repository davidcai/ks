var service = require('./server/service.js')
  , express = require('express')
  , app = express();


//
// App config
//

app.configure(function(){
//  app.use('/media', express.static(__dirname + '/media'));
  app.use(express.static(__dirname + '/public/'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//
// Routes
//

// app.get('/stories/:storyId', function(req, res) {
//   var q = tblStories
//     .select(tblStories.star())
//     .from(tblStories)
//     .where(tblStories.id.equals(req.params.storyId))
//     .toQuery();

//   console.log(q);

//   client.query(q, function(err, result) {
//       assert.equal(null, err);

//       res.json(result.rows.length > 0 ? result.rows[0] : {});
//     }
//   );
// });


app.get('/stories', function(req, res) {
  var groupBy = req.param('groupBy');

  if (groupBy === 'teams') {
    service.groupStoriesByTeams()
      .then(function(teams) {
        res.json(teams);
      })
      .done();
  }
  else if (groupBy === 'initiatives') {
    service.groupStoriesByInitiatives()
      .then(function(initiatives) {
        res.json(initiatives);
      })
      .done();
  }
  else {

    // // Find all stories

    // q = tblStories
    //   .select(tblStories.star())
    //   .from(tblStories)
    //   .toQuery();

    // console.log(q);

    // client.query(q, function(err, result) {
    //   assert.equal(null, err);

    //   res.json(result.rows);
    // });
  }
});


//
// Start listening
//

app.listen(3000);
console.log('Listening on port 3000');