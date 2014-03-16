// FE.log shim
var FE = {
  log: angular.noop
  // function(msg) {
  //   if (console && console.log) {
  //     console.log(msg);
  //   }
  // }
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
    'reserveAmounts', 
    'remainingAmounts', 
    '$scope', 
    '$log',

    function(
      incomeSourceMap, 
      savingSources, 
      stackedBarchartConfigMap, 
      reserveAmounts, 
      remainingAmounts, 
      $scope, 
      $log) {

      $scope.pctKey = '50'
      $scope.barIndex = 3;

      $scope.incomeSourceMap = incomeSourceMap;
      $scope.savingSources = savingSources;
      $scope.stackedBarchartConfigMap = stackedBarchartConfigMap;
      $scope.reserveAmounts = reserveAmounts;
      $scope.remainingAmounts = remainingAmounts;

      // Goal line
      $scope.showGoal = false;
      $scope.toggleGoal = function(show) {
        $scope.showGoal = show;
      };

      // Workaround to cope with range input's onchange quirks.
      $scope.newPctKey = $scope.pctKey;
      $scope.onPctMouseup = function() {
        // Change only when the mouse is up.
        if ($scope.newPctKey != $scope.pctKey) {
          $scope.pctKey = $scope.newPctKey;
        }
      };

    }]);