angular.module('app', ['ui.router', 'model'])


  // State/URL routing
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/initiatives");

    $stateProvider
      .state('teams', {
        url: '/teams', templateUrl: 'partials/teams.html', controller: 'TeamsCtrl'
      });
      // .state('themes', {
      //   url: '/themes', templateUrl: 'partials/themes.html', controller: 'ThemesCtrl'
      // })
      // .state('releases', {
      //   url: '/releases', templateUrl: 'partials/releases.html', controller: 'ReleasesCtrl'
      // });
  }])


  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }])


  // Main controller
  .controller('MainCtrl', ['$scope', '$log', function($scope, $log) {
    
    $log.log('MainCtrl');
    
    // // Releases
    // var releases = _.uniq(_.pluck($scope.data.stories, 'release'));
    // releases = _.map(releases, function(release) {
    //   return { date: new Date(release), value: release };
    // });
    // $scope.data.releases = releases;

    // //
    // $scope.getThemeById = function(themeId) {
    //   $log.log(themeId);
    //   return _.findWhere($scope.data.themes, { id: themeId });
    // }
  }])


  // Navigation bar controller
  .controller('NavCtrl', ['$scope', '$log', function($scope, $log) {
    
    $log.log('NavCtrl');
  }])


  // Teams view controller
  .controller('TeamsCtrl', ['Story', '$scope', '$log', function(Story, $scope, $log) {

    $log.log('TeamsCtrl');

    var stories = Story.query({groupBy: 'team'}, function() {

      var teams = {};
      var releases = {};

      _.each(stories, function(story) {
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
          releases[story.release] = new Date(story.release);
        }
      });

      $scope.teams = teams;
      $log.log(teams);
      $log.log(releases);
    });

    // var story = Story.get({ storyId: 14 }, function() {
    //   $log.log(story);
    // });
  }])


  // Themes view controller
  .controller('ThemesCtrl', ['$scope', '$log', function($scope, $log) {

    $log.log('ThemesCtrl');
  }])


  // Releases view controller
  .controller('ReleasesCtrl', ['$scope', '$log', function($scope, $log) {

    $log.log('ReleasesCtrl');
  }]);