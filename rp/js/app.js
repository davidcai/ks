angular.module('app', ['ui.router'])


  // State/URL routing
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/initiatives");

    $stateProvider
      .state('teams', {
        url: '/teams', templateUrl: 'partials/teams.html', controller: 'TeamsCtrl'
      })
      .state('themes', {
        url: '/themes', templateUrl: 'partials/themes.html', controller: 'ThemesCtrl'
      })
      .state('releases', {
        url: '/releases', templateUrl: 'partials/releases.html', controller: 'ReleasesCtrl'
      });
  }])


  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }])


  // Main controller
  .controller('MainCtrl', ['$scope', '$log', 'dataModel', function($scope, $log, dataModel) {
    
    $log.log('MainCtrl');

    $scope.data = dataModel;
    
    // Releases
    var releases = _.uniq(_.pluck($scope.data.stories, 'release'));
    releases = _.map(releases, function(release) {
      return { date: new Date(release), value: release };
    });
    $scope.data.releases = releases;

    //
    $scope.getThemeById = function(themeId) {
      $log.log(themeId);
      return _.findWhere($scope.data.themes, { id: themeId });
    }
  }])


  // Navigation bar controller
  .controller('NavCtrl', ['$scope', '$log', function($scope, $log) {
    
    $log.log('NavCtrl');
  }])


  // Teams view controller
  .controller('TeamsCtrl', ['$scope','$log', function($scope, $log) {

    $log.log('TeamsCtrl');
  }])


  // Themes view controller
  .controller('ThemesCtrl', ['$scope','$log', function($scope, $log) {

    $log.log('ThemesCtrl');
  }])


  // Releases view controller
  .controller('ReleasesCtrl', ['$scope','$log', function($scope, $log) {

    $log.log('ReleasesCtrl');
  }])


  // Data model
  .value('dataModel', {
    stories: [
      {
        id: 0
        , description: 'story 1'
        , owner: 'David'
        , theme_id: 0
        , team_id: 0
        , release: '2013/12'
        , notes: 'Notes go here'
      }
      , {
        id: 1
        , description: 'story 2'
        , owner: 'David'
        , theme_id: 1
        , team_id: 1
        , release: '2013/10'
        , notes: 'Notes go here'
      }
      , {
        id: 2
        , description: 'story 3'
        , owner: 'Patrick'
        , theme_id: 2
        , team_id: 3
        , release: '2013/9'
        , notes: 'Notes go here'
      }
      , {
        id: 3
        , description: 'story 4'
        , owner: 'David'
        , theme_id: 1
        , team_id: 0
        , release: '2013/10'
        , notes: 'Notes go here'
      }
      , {
        id: 4
        , description: 'story 5'
        , owner: 'Patrick'
        , theme_id: 3
        , team_id: 2
        , release: '2013/11'
        , notes: 'Notes go here'
      }
      , {
        id: 5
        , description: 'story 6'
        , owner: 'Ellen'
        , theme_id: 2
        , team_id: 4
        , release: '2013/11'
        , notes: 'Notes go here'
      }
      , {
        id: 6
        , description: 'story 7'
        , owner: 'Patrick'
        , theme_id: 1
        , team_id: 3
        , release: '2013/9'
        , notes: 'Notes go here'
      }
      , {
        id: 7
        , description: 'story 8'
        , owner: 'David'
        , theme_id: 0
        , team_id: 1
        , release: '2013/9'
        , notes: 'Notes go here'
      }
      , {
        id: 8
        , description: 'story 9'
        , owner: 'David'
        , theme_id: 2
        , team_id: 4
        , release: '2013/10'
        , notes: 'Notes go here'
      }
      , {
        id: 9
        , description: 'story 10'
        , owner: 'Ellen'
        , theme_id: 1
        , team_id: 5
        , release: '2013/9'
        , notes: 'Notes go here'
      }
    ]
    
    , themes: [
      { id: 0, name: 'Current business', color: "yellow" }
      , { id: 1, name: 'IRA', color: 'green' }
      , { id: 2, name: 'Technology debt', color: 'orange' }
      , { id: 3, name: 'Theme 1', color: 'red' }
      , { id: 4, name: 'Theme 2', color: 'cyan' }
    ]

    , teams: [
      { id: 0, name: 'Team 1', product_owner: 'John', scrum_master: 'Kevin' }
      , { id: 1, name: 'Team 2', product_owner: 'Jane', scrum_master: 'Kevin' }
      , { id: 2, name: 'Team 3', product_owner: 'Wendy', scrum_master: 'Tim' }
      , { id: 3, name: 'Team 4', product_owner: 'Sussie', scrum_master: 'Tim' }
      , { id: 4, name: 'Team 3.5', product_owner: 'Tom', scrum_master: 'Michael' }
      , { id: 5, name: 'Team 6', product_owner: 'Joe', scrum_master: 'Michael' }
      , { id: 6, name: 'Team nada', product_owner: 'Joe', scrum_master: 'Michael' }
    ]
  });