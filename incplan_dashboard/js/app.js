angular.module('app', [])

  .controller('MainCtrl', [

    'incomeSourceMap', 'savingSources', '$scope', '$log',
    function(incomeSourceMap, savingSources, $scope, $log) {

    var strPctKey = '50'
      , nBarIndex = 3;

    $scope.incomeSources = incomeSourceMap[strPctKey][nBarIndex];
    $scope.savingSources = savingSources;

    $scope.incomePlan = {
      retAge: 66, 

      totalIncome: "$48,500", 
      savingsIncome: "$0", 
      workIncome: "$43,,500", 
      otherIncome: "$0", 
      socSecIncome: "$5,000",

      totalSavings: "$100,000", 
      jcpSavings: "$100,000", 

      barchartConfig: "This is awesome!"
    };

    $scope.setBarchartConfig = function(config) {
      $scope.incomePlan.barchartConfig = config;
      //$scope.incomeSources = incomeSourceMap[strPctKey][++nBarIndex];
    };

  }]);