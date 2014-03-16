// FE.log shim
var FE = {
  log: function(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  }
};


angular.module('app', [])

  // safeApply (https://coderwall.com/p/ngisma)
  .factory('safeApply', ['$rootScope', function($rootScope) {
    return function(scope, fn) {
      var phase = $rootScope.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn) {
          scope.$eval(fn);
        }
      } else {
        if (fn) {
          scope.$apply(fn);
        } else {
          scope.$apply();
        }
      }
    }
  }])


  .controller('MainCtrl', [

    'incomeSourceMap', 
    'savingSources', 
    'stackedBarchartConfigMap', 
    '$scope', 
    '$log',

    function(
      incomeSourceMap, 
      savingSources, 
      stackedBarchartConfigMap, 
      $scope, 
      $log) {

      $scope.pctKey = '50'
      $scope.barIndex = 3;

      $scope.incomeSources = incomeSourceMap[$scope.pctKey][$scope.barIndex];
      $scope.savingSources = savingSources;
      $scope.barchartConfig = stackedBarchartConfigMap[$scope.pctKey];

      $scope.showGoal = false;
      $scope.toggleGoal = function(show) {
        $scope.showGoal = show;
      }

      $scope.setBarchartConfig = function(config) {
        $scope.barchartConfig = stackedBarchartConfigMap["20"];
        //$scope.incomeSources = incomeSourceMap[strPctKey][++nBarIndex];
      };

      // $log.log($scope.barchartConfig);

    }]);