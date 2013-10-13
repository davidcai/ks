var sql = require('sql')
  , pg = require('pg')
  , connConfig = { user: 'postgres', password: 'P@ssword', database: 'rp', host: 'localhost', port: '5432'}
  , client;


//
// DB connection
//

client = new pg.Client(connConfig);
client.connect();
exports.client = client;


//
// Table definitions
//

exports.teams = sql.define({
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


exports.themes = sql.define({
  name: 'themes', 
  columns: [
    'id', 
    'name', 
    'color'
  ]
});


exports.initiatives = sql.define({
  name: 'initiatives', 
  columns: [
    'id', 
    {
      name: 'theme_id', 
      property: 'themeId'
    }, 
    'name'
  ]
});


exports.stories = sql.define({
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