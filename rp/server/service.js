var _ = require('underscore')
  // , assert = require('assert')
  , Q = require('q')
  , sql = require('sql')
  , model = require('./model.js')
  , tblTeams = model.teams
  , tblInitiatives = model.initiatives
  , tblThemes = model.themes
  , tblStories = model.stories;


//
// groupStoriesByTeams
//

exports.groupStoriesByTeams = function() {

  var deferred = Q.defer()
    , query;

  query = tblTeams
    .select(
      tblTeams.id.as('teamId'), 
      tblTeams.name.as('teamName'),
      tblTeams.po, 
      tblTeams.sm, 
      tblStories.id, 
      tblStories.name, 
      tblStories.initiativeId, 
      tblStories.owner, 
      tblStories.release,
      tblStories.notes, 
      tblThemes.id.as('themeId'), 
      tblThemes.name.as('themeName'), 
      tblThemes.color.as('themeColor')
    )
    .from(
      tblTeams
        .leftJoin(tblStories)
          .on(tblTeams.id.equals(tblStories.teamId))
        .leftJoin(tblInitiatives)
          .on(tblInitiatives.id.equals(tblStories.initiativeId))
        .leftJoin(tblThemes)
          .on(tblThemes.id.equals(tblInitiatives.themeId))
    )
    .toQuery();

  console.log(query);

  model.client.query(query, function(err, result) {
    if (err) {
      deferred.reject(err);
    }

    var teams = {};
    // var releases = {};

    _.each(result.rows, function(story) {
      var team = teams[story.teamId];
      if (!team) {
        team = {
          id: story.teamId, 
          name: story.teamName, 
          po: story.po, 
          sm: story.sm, 
          stories: []
        };
        teams[story.teamId] = team;
      }

      if (story.id) {
        team.stories.push(story);
        // releases[story.release] = new Date(story.release);
      }
    });

    deferred.resolve(teams);
  });

  return deferred.promise;
};


//
// groupStoriesByInitiatives
//

exports.groupStoriesByInitiatives = function() {

  var deferred = Q.defer()
    , query;

  query = tblInitiatives
    .select(
      tblInitiatives.id.as('initiativeId'), 
      tblInitiatives.themeId, 
      tblInitiatives.name.as('initiativeName'), 
      tblStories.id, 
      tblStories.name, 
      tblStories.teamId, 
      tblStories.owner, 
      tblStories.release,
      tblStories.notes, 
      tblThemes.id.as('themeId'), 
      tblThemes.name.as('themeName'), 
      tblThemes.color.as('themeColor')
    )
    .from(
      tblInitiatives
        .leftJoin(tblStories)
          .on(tblInitiatives.id.equals(tblStories.initiativeId))
        .leftJoin(tblThemes)
          .on(tblThemes.id.equals(tblInitiatives.themeId))
    )
    .toQuery();

  console.log(query);

  model.client.query(query, function(err, result) {
    if (err) {
      deferred.reject(err);
    }

    var initiatives = {};

    _.each(result.rows, function(story) {
      var initiative = initiatives[story.initiativeId];
      if (!initiative) {
        initiative = {
          id: story.initiativeId, 
          name: story.initiativeName, 
          stories: []
        };
        initiatives[story.initiativeId] = initiative;
      }

      if (story.id) {
        initiative.stories.push(story);
        // releases[story.release] = new Date(story.release);
      }
    });

    deferred.resolve(initiatives);
  });

  return deferred.promise;
};

