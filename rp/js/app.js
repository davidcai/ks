angular.module('app', [])
	.controller('MainCtrl', ['$scope', '$log', function($scope, $log) {
		$log.log('This is a test');
		$scope.data = "hello";
	}]);