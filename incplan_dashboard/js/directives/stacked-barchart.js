angular.module('app')

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
        };
      }
    };
    
  }]);