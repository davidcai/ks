var FE = {
  log: function(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  }
};

angular.module('app', [])

  .controller('MainCtrl', [

    'incomeSourceMap', 'savingSources', 'stackedBarchartConfigMap', 
      '$scope', '$log',

    function(incomeSourceMap, savingSources, stackedBarchartConfigMap, 
      $scope, $log) {

    $scope.pctKey = '50'
    $scope.barIndex = 3;

    $scope.incomeSources = incomeSourceMap[$scope.pctKey][$scope.barIndex];
    $scope.savingSources = savingSources;
    $scope.barchartConfig = stackedBarchartConfigMap[$scope.pctKey];


    $scope.setBarchartConfig = function(config) {
      $scope.barchartConfig = stackedBarchartConfigMap["20"];
      //$scope.incomeSources = incomeSourceMap[strPctKey][++nBarIndex];
    };

    $log.log($scope.barchartConfig);

  }]);