angular.module('app', ['ui.router', 'app.services'])


  // State/URL routing
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/initiatives");

    $stateProvider
      .state('teams', {
        url: '/teams', templateUrl: 'partials/teams.html', controller: 'TeamsCtrl'
      })
      .state('initiatives', {
        url: '/initiatives', templateUrl: 'partials/initiatives.html', controller: 'InitiativesCtrl'
      });
      // .state('themes', {
      //   url: '/themes', templateUrl: 'partials/themes.html', controller: 'ThemesCtrl'
      // });
  }])


  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }])


  // Main controller
  .controller('MainCtrl', ['$scope', '$log', function($scope, $log) {
    
    $log.log('MainCtrl');
  }])


  // Navigation bar controller
  .controller('NavCtrl', ['$scope', '$log', function($scope, $log) {
    
    $log.log('NavCtrl');
  }])


  // Teams view controller
  .controller('TeamsCtrl', ['storyService', '$scope', '$log', function(storyService, $scope, $log) {

    $log.log('TeamsCtrl');

    storyService.groupByTeams().then(function(result) {

      $log.log(result.data);

      $scope.teams = result.data;
    });
  }])


  // Initiatives view controller
  .controller('InitiativesCtrl', ['storyService', '$scope', '$log', function(storyService, $scope, $log) {

    $log.log('InitiativesCtrl');

    storyService.groupByInitiatives().then(function(result) {

      $log.log(result.data);

      $scope.initiatives = result.data;
    });
  }])


  // Themes view controller
  .controller('ThemesCtrl', ['$scope', '$log', function($scope, $log) {

    $log.log('ThemesCtrl');
  }]);