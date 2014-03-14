angular.module('app')

  .directive('stackedBarchart', ['$log', function($log) {

    return {
      restrict: 'AE', 
      
      scope: {
        'config': '='
      }, 

      link: function(scope, element, attrs) {

        function updateUi() {
          element.html('');

          var id = attrs.id
            , paper = Raphael(id, 550, 300)
            , text = paper.text(50, 50, scope.config || '');

          text.attr({
            'text-anchor': 'start', 
            'font-size': 16, 
            'font-weight': 'bold', 
            'fill': '#4c4c4c'
          });
        }

        //updateUi();

        scope.$watch(
          
          function() { return scope.config; },

          function(newVal, oldVal) {
            $log.log(newVal + ' : ' + oldVal);

            //if (newVal !== oldVal) {
              updateUi();
            //}
          }
        ); // end of $watch

      } // end of link
    };
    
  }]);