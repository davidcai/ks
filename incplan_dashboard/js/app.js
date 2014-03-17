// FE.log shim
var FE = {
  log: angular.noop
  // function(msg) {
  //   if (console && console.log) {
  //     console.log(msg);
  //   }
  // }
};


angular.module('app', ['ui.bootstrap'])

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
    '$modal', 
    '$log',

    function(
      incomeSourceMap, 
      savingSources, 
      stackedBarchartConfigMap, 
      reserveAmounts, 
      remainingAmounts, 
      $scope, 
      $modal, 
      $log) {

      $scope.socSecStrategy = 'mySelection';
      $scope.pctKey = '50'
      $scope.barIndex = 3;

      $scope.incomeSourceMap = incomeSourceMap;
      $scope.savingSources = savingSources;
      $scope.stackedBarchartConfigMap = stackedBarchartConfigMap;
      $scope.reserveAmounts = reserveAmounts;
      $scope.remainingAmounts = remainingAmounts;

      // Goal line
      $scope.showGoal = false;

      // Workaround to cope with range input's onchange quirks.
      $scope.newPctKey = $scope.pctKey;
      $scope.onPctMouseup = function() {
        // Change only when the mouse is up.
        if ($scope.newPctKey != $scope.pctKey) {
          $scope.pctKey = $scope.newPctKey;
        }
      };

      // Open edit modal dialog
      $scope.edit = function() {

        var modalInstance = $modal.open({
          
          templateUrl: 'edit.html', 

          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

            $scope.save = function() {
              $modalInstance.close();
            };

            $scope.cancel = function() {
              $modalInstance.dismiss();
            }
          }]
        });

        modalInstance.result.then(
          function() {
            $log.log('Saved');
          }, 
          function() {
            $log.log('Cancelled');
          }
        );
      }; // end of $scope.edit

    }]);