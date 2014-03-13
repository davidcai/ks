angular.module('app', ['app.directives'])
  .controller('MainCtrl', ['$scope', '$log', function($scope, $log) {

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
    };

  }]);


angular.module('app.directives', [])
  .directive('stackedBarchart', ['$log', function($log) {

    return {
      restrict: 'A', 
      require: 'ngModel', 
      // scope: {
      //   'config': '@config'
      // }, 
      link: function($scope, $element, $attrs, ngModel) {

        ngModel.$render = function() {

          $element.html('');

          var id = $attrs.id
            , paper = Raphael(id, 550, 300)
            , text = paper.text(50, 50, ngModel.$viewValue || '');

          text.attr({
            'text-anchor': 'start', 
            'font-size': 16, 
            'font-weight': 'bold', 
            'fill': '#4c4c4c'
          });

          //$element.html('<div class="test">This is a test</div>');

        };
      }
    };
  }]);