angular.module('app')

  .directive('stackedBarchart', ['$log', function($log) {

    return {
      restrict: 'AE', 
      
      scope: {
        'config': '='
      }, 

      link: function(scope, element, attrs) {

        var id = attrs.id
          , width = parseInt(attrs.width, 10)
          , height = parseInt(attrs.height, 10);

        //
        // Update UI
        //

        function updateUi() {

          element.html('');

          YUI().use('fe-stacked-barchart', function(Y) {

            var barChart = new Y.FE.StackedBarChart(id, width, height, scope.config);
            barChart.render();
          });
        }

        
        scope.$watch(
          
          function() { return scope.config; },

          function(newVal, oldVal) {
            $log.log(newVal + ' : ' + oldVal);

            updateUi();
          }
        ); // end of $watch

      } // end of link
    };
    
  }]);