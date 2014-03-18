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
    '$timeout', 
    '$log',

    function(
      incomeSourceMap, 
      savingSources, 
      stackedBarchartConfigMap, 
      reserveAmounts, 
      remainingAmounts, 
      $scope, 
      $modal, 
      $timeout, 
      $log) {

      $scope.socSecStrategy = 'mySelection';
      $scope.loadingStrategy = false;
      $scope.pctKey = '50'
      $scope.barIndex = 3;
      $scope.showGoal = false;
      $scope.startAges = [64, 65];

      $scope.incomeSourceMap = incomeSourceMap;
      $scope.savingSources = savingSources;
      $scope.stackedBarchartConfigMap = stackedBarchartConfigMap;
      $scope.reserveAmounts = reserveAmounts;
      $scope.remainingAmounts = remainingAmounts;

      function loadStrategy() {
        $scope.loadingStrategy = true;

        // Fake AJAX request. 
        // Reset the flag to false when the response returns.
        $timeout(function() {
          $scope.loadingStrategy = false;            
        }, 700);
      }

      // Track socSecStrategy changes
      $scope.$watch('socSecStrategy', function(newVal, oldVal) {
        $log.log('$scope.socSecStrategy: ' + oldVal + ' to ' + newVal);

        if (newVal != oldVal) {
          loadStrategy();
        }
      });

      // Workaround to cope with range input's onchange quirks.
      $scope.newPctKey = $scope.pctKey;
      $scope.onPctMouseup = function() {
        // Change only when the mouse is up.
        if ($scope.newPctKey != $scope.pctKey) {
          $scope.pctKey = $scope.newPctKey;
        }
      };

      // $scope.newStartAge1 = $scope.startAge1;
      // $scope.newStartAge2 = $scope.startAge2;

      // Open edit modal dialog
      $scope.edit = function() {

        var modalInstance = $modal.open({
          
          templateUrl: 'edit.html', 

          controller: ['$scope', '$modalInstance', 'ages', function($scope, $modalInstance, ages) {

            $scope.ages = ages;

            $scope.save = function() {
              $modalInstance.close($scope.ages);
            };

            $scope.cancel = function() {
              $modalInstance.dismiss();
            };
          }], 

          resolve: {
            ages: function() {
              return [$scope.startAges[0], $scope.startAges[1]];
            }
          }
        });

        modalInstance.result.then(
          function(ages) {
            $log.log('Saved');
            
            // Pass the changes ages back to scope
            $scope.startAges = [parseInt(ages[0], 10), parseInt(ages[1], 10)];

            loadStrategy();
          }, 
          function() {
            $log.log('Cancelled');
          }
        );
      }; // end of $scope.edit

    }]);