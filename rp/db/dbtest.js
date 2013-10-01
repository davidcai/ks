var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/rp", function(err, db) {

  if(err) { 
    return console.dir(err); 
  }

  db.collection("test_collection").update({a: 1}, {b: 1}, {upsert: true}, function(err, result) {
    if(err) { 
      return console.dir(err); 
    }

    db.collection("test_collection").drop(function(err, reply) {
      if(err) { 
        return console.dir(err); 
      }

      db.close();
    });
  });
});