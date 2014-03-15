angular.module('app', [])

  .controller('MainCtrl', [

    'incomeSourceMap', 'savingSources', 'stackedBarchartConfigMap', 
      '$scope', '$log',
    function(incomeSourceMap, savingSources, stackedBarchartConfigMap, 
      $scope, $log) {

    var strPctKey = '50'
      , nBarIndex = 3;

    $scope.incomeSources = incomeSourceMap[strPctKey][nBarIndex];
    $scope.savingSources = savingSources;
    $scope.barchartConfig = stackedBarchartConfigMap[strPctKey];

    $scope.incomePlan = {
      barchartConfig: "This is awesome!"
    };

    $scope.setBarchartConfig = function(config) {
      $scope.incomePlan.barchartConfig = config;
      //$scope.incomeSources = incomeSourceMap[strPctKey][++nBarIndex];
    };

    $log.log($scope.barchartConfig);

  }]);