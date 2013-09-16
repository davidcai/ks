angular.module('app', ['ui.router'])


  // State/URL routing
  .config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/initiatives");

    $stateProvider
      .state('teams', {
        url: '/teams', templateUrl: 'partials/teams.html', controller: 'TeamsCtrl'
      })
      .state('initiatives', {
        url: '/initiatives', templateUrl: 'partials/initiatives.html', controller: 'InitiativesCtrl'
      });
  }])


  // Main controller
  .controller('MainCtrl', 
    ['$scope', '$log', 'dataModel', function($scope, $log, dataModel) {
    
    $log.log('MainCtrl');

    $scope.data = dataModel;

    $scope.groupBy = 'initiatives';
  }])


  // Navigation bar controller
  .controller('NavCtrl', 
    ['$scope', '$log', function($scope, $log) {
    
    $log.log('NavCtrl');
  }])


  // Teams view controller
  .controller('TeamsCtrl', 
    ['$scope', function($scope) {

    $scope.data = 'teams';
  }])


  // Initiatives view controller
  .controller('InitiativesCtrl', 
    ['$scope', function($scope) {

    $scope.data = 'initiatives';
  }])


  // Data model
  .value('dataModel', {
    stories: [
      {
        id: 0
        , description: 'story 1'
        , owner: 'David'
        , theme_id: null
        , initiative_id: 0
        , team_id: 0
        , release: 'Sep 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 1
        , description: 'story 2'
        , owner: 'David'
        , theme_id: null
        , initiative_id: 1
        , team_id: 1
        , release: 'Oct 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 2
        , description: 'story 3'
        , owner: 'Patrick'
        , theme_id: null
        , initiative_id: 2
        , team_id: 3
        , release: 'Sep 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 3
        , description: 'story 4'
        , owner: 'David'
        , theme_id: null
        , initiative_id: 1
        , team_id: 0
        , release: 'Oct 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 4
        , description: 'story 5'
        , owner: 'Patrick'
        , theme_id: null
        , initiative_id: 3
        , team_id: 2
        , release: 'Nov 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 5
        , description: 'story 6'
        , owner: 'Ellen'
        , theme_id: null
        , initiative_id: 2
        , team_id: 4
        , release: 'Nov 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 6
        , description: 'story 7'
        , owner: 'Patrick'
        , theme_id: null
        , initiative_id: 1
        , team_id: 3
        , release: 'Sep 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 7
        , description: 'story 8'
        , owner: 'David'
        , theme_id: null
        , initiative_id: 0
        , team_id: 1
        , release: 'Sep 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 8
        , description: 'story 9'
        , owner: 'David'
        , theme_id: null
        , initiative_id: 2
        , team_id: 4
        , release: 'Oct 2013'
        , notes: 'Notes go here'
      }
      , {
        id: 9
        , description: 'story 10'
        , owner: 'Ellen'
        , theme_id: null
        , initiative_id: 1
        , team_id: 5
        , release: 'Sep 2013'
        , notes: 'Notes go here'
      }
    ]
    
    , themes: [
      { id: 0, name: 'yellow' }
      , { id: 1, name: 'green' }
      , { id: 2, name: 'orange' }
      , { id: 3, name: 'red' }
      , { id: 4, name: 'cyan' }
    ]

    , teams: [
      { id: 0, name: 'Team 1', product_owner: 'John', scrum_master: 'Kevin' }
      , { id: 1, name: 'Team 2', product_owner: 'Jane', scrum_master: 'Kevin' }
      , { id: 2, name: 'Team 3', product_owner: 'Wendy', scrum_master: 'Tim' }
      , { id: 3, name: 'Team 4', product_owner: 'Sussie', scrum_master: 'Tim' }
      , { id: 4, name: 'Team 5', product_owner: 'Tom', scrum_master: 'Michael' }
      , { id: 5, name: 'Team 6', product_owner: 'Joe', scrum_master: 'Michael' }
    ]

    , initiatives: [
      { id: 0, name: 'Current business', theme_id: 0 }
      , { id: 1, name: 'IRA', theme_id: 1 }
      , { id: 2, name: 'Technology debt', theme_id: 2 }
    ]
  });