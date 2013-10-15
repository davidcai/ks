angular.module('app', ['ui.router', 'app.services'])


  // State/URL routing
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/teams");

    $stateProvider
      .state('teams', {
        url: '/teams', templateUrl: 'partials/teams.html', controller: 'TeamsCtrl'
      })
      .state('initiatives', {
        url: '/initiatives', templateUrl: 'partials/initiatives.html', controller: 'InitiativesCtrl'
      })
      .state('themes', {
        url: '/themes', templateUrl: 'partials/themes.html', controller: 'ThemesCtrl'
      });
  }])


  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }])


  // Main controller
  .controller('MainCtrl', ['$scope', '$log', function($scope, $log) {
    $log.log('MainCtrl');

    $scope.selectRelease = function(release) {
      $scope.selectedRelease = release;
    };
  }])


  // Navigation bar controller
  .controller('NavCtrl', ['$scope', '$log', function($scope, $log) {
    $log.log('NavCtrl');
  }])


  // Teams view controller
  .controller('TeamsCtrl', ['storyService', '$scope', '$log', function(storyService, $scope, $log) {
    $log.log('TeamsCtrl');

    storyService.groupByTeams()
      .then(function(result) {

        $log.log(result.data);
        $scope.teams = result.data.teams;
        $scope.releases = result.data.releases;
      });
  }])


  // Initiatives view controller
  .controller('InitiativesCtrl', ['storyService', '$scope', '$log', function(storyService, $scope, $log) {
    $log.log('InitiativesCtrl');

    storyService.groupByInitiatives()
      .then(function(result) {

        $log.log(result.data);
        $scope.initiatives = result.data.initiatives;
        $scope.releases = result.data.releases;
      });
  }])


  // Themes view controller
  .controller('ThemesCtrl', ['storyService', '$scope', '$log', function(storyService, $scope, $log) {
    $log.log('ThemesCtrl');

    storyService.groupByThemes()
      .then(function(result) {

        $log.log(result.data);
        $scope.themes = result.data.themes;
        $scope.releases = result.data.releases;
      });
  }]);