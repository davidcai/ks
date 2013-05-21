angular.module('app', ['app.data']).
	controller('CalCtrl', ['$scope', '$http', '$log', 'data', function($scope, $http, $log, data) {

		$scope.pointIndex = 0;
		$scope.scale = data.scale;
		$scope.difficulties = data.difficulties;
		$scope.groups = data.groups;

		function getDiffIndex(item) {
			if (typeof item.diffIndex == 'undefined') {
				item.diffIndex = 1;
			}

			return item.diffIndex;
		}

		function calculatePointIndex() {
			var pointIndex = 0;

			angular.forEach($scope.groups, function(group) {
				angular.forEach(group.items, function(item) {
					if (item.selected) {
						pointIndex += item.weight * $scope.difficulties[getDiffIndex(item)].multiple;
					}
				})
			});

			return pointIndex;
		}

		function updatePointIndex() {
			$scope.pointIndex = calculatePointIndex();
			$log.log('idx = ' + $scope.pointIndex + ', x = ' + $scope.getScaleX($scope.pointIndex));
		}

		function uncheckItem(item, update) {
			item.selected = false;
			item.diffIndex = 1;

			if (update === true) {
				updatePointIndex();
			}
		}

		$scope.toggleItem = function(item) {
			item.selected = !item.selected;
			item.diffIndex = 1;

			updatePointIndex();
		};

		$scope.getScaleX = function(nIndex) {
			return 100 * nIndex / ($scope.scale.length - 1) + '%';
		};

		$scope.getDiffName = function(item) {
			return $scope.difficulties[getDiffIndex(item)].name;
		};

		$scope.decreaseDiff = function(item) {
			var index = getDiffIndex(item);
			if (index > 0) {
				item.diffIndex = index - 1;
				updatePointIndex();
			}
			else {
				uncheckItem(item, true);
			}
		};

		$scope.increaseDiff = function(item) {
			var index = getDiffIndex(item);
			if (index < $scope.difficulties.length - 1) {
				item.diffIndex = index + 1;
				updatePointIndex();
			}
		};

		$scope.clearGroup = function(group) {
			angular.forEach(group.items, function(item) {
				uncheckItem(item, false);
			});

			updatePointIndex();
		};

		$scope.clearAll = function() {
			angular.forEach($scope.groups, function(group) {
				angular.forEach(group.items, function(item) {
					uncheckItem(item, false);
				})
			});

			updatePointIndex();
		};

	}]);

/*
angular.module('app', ['app.controllers', 'app.data']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', { templateUrl: 'partials/cal.html', controller: 'CalCtrl' });
		$routeProvider.otherwise({ redirectTo: '/' });
	}]);

angular.module('app.controllers', []).
	controller('CalCtrl', ['$scope', '$http', 'data', function($scope, $http, data) {
		$scope.data = data;
	}]);
*/
