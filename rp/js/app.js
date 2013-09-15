angular.module('app', [])

  .controller('NavCtrl', 
    ['$scope', '$log', function($scope, $log) {
    
    $log.log('NavCtrl');
  }])

	.controller('MainCtrl', 
    ['$scope', '$log', function($scope, $log) {
		
    $log.log('MainCtrl');
		$scope.data = "hello";
	}]);