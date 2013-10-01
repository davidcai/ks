var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

MongoClient.connect("mongodb://localhost:27017/rp", function(err, db) {
  assert.equal(null, err);

  // Create and pop themes collection
  db.collection("themes").drop(function(err, reply) {
    assert.equal(null, err);

    db.createCollection('themes', {w: 1}, function(err, themes) {
      assert.equal(null, err);

      themes.insert(
        [
          { 
            id: 0
            , name: 'Theme 0'
            , color: "yellow"

            , initiatives: [
              {
                id: 0
                , name: 'Initiative 0'

                , stories: [
                  {
                    id: 0
                    , name: 'Story 0'
                    , owner: 'Ellen'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 1
                    , name: 'Story 1'
                    , owner: 'David'
                    , release: '2013/10'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 2
                    , description: 'Story 2'
                    , owner: 'Patrick'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }

              , {
                id: 1
                , name: 'Initiative 1'

                , stories: [
                  {
                    id: 3
                    , name: 'Story 3'
                    , owner: 'Ellen'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 4
                    , description: 'Story 4'
                    , owner: 'Patrick'
                    , release: '2013/11'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }

              , {
                id: 2
                , name: 'Initiative 2'

                , stories: [
                  {
                    id: 5
                    , name: 'Story 5'
                    , owner: 'Ellen'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 6
                    , description: 'Story 6'
                    , owner: 'Patrick'
                    , release: '2013/11'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 7
                    , description: 'Story 7'
                    , owner: 'David'
                    , release: '2013/11'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }
            ] //-- initiatives
          }

          , { 
            id: 1
            , name: 'Theme 1'
            , color: "red"

            , initiatives: [
              {
                id: 3
                , name: 'Initiative 3'

                , stories: [
                  {
                    id: 8
                    , name: 'Story 8'
                    , owner: 'Ellen'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 9
                    , name: 'Story 9'
                    , owner: 'David'
                    , release: '2013/10'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }

              , {
                id: 4
                , name: 'Initiative 4'

                , stories: [
                  {
                    id: 10
                    , name: 'Story 10'
                    , owner: 'David'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 11
                    , description: 'Story 11'
                    , owner: 'Patrick'
                    , release: '2013/11'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }
            ] //-- initiatives
          }

          , { 
            id: 2
            , name: 'Theme 2'
            , color: "orange"

            , initiatives: [
              {
                id: 5
                , name: 'Initiative 5'

                , stories: [
                  {
                    id: 12
                    , name: 'Story 12'
                    , owner: 'Ellen'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 13
                    , name: 'Story 13'
                    , owner: 'Patrick'
                    , release: '2013/10'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }
            ] //-- initiatives
          }

          , { 
            id: 3
            , name: 'Theme 3'
            , color: "green"

            , initiatives: [
              {
                id: 6
                , name: 'Initiative 6'

                , stories: [
                  {
                    id: 14
                    , name: 'Story 14'
                    , owner: 'Ellen'
                    , release: '2013/9'
                    , notes: 'Notes go here'
                  }
                  , {
                    id: 15
                    , name: 'Story 15'
                    , owner: 'Patrick'
                    , release: '2013/10'
                    , notes: 'Notes go here'
                  }
                ] //-- stories
              }
            ] //-- initiatives
          }
        ]

        , {w: 1}
        , function(err, result) {       
          assert.equal(null, err);
          
          db.close();
        });
    });
  });
});