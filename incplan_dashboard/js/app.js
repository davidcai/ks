angular.module('app', [])

  .controller('MainCtrl', ['$scope', '$log', function($scope, $log) {

    $scope.incomePlan = {
      retAge: 66, 

      totalIncome: "$48,500", 
      savingsIncome: "$0", 
      workIncome: "$43,,500", 
      otherIncome: "$0", 
      socSecIncome: "$5,000",

      totalSavings: "$100,000", 
      jcpSavings: "$100,000"
    };

  }]);
