angular.module('app')

  .directive('stackedBarchart', ['safeApply', '$log', function(safeApply, $log) {

    return {
      restrict: 'AE', 
      
      scope: {
        'config': '=', 
        'barIndex': '=', 
        'goalLine': '='
      }, 

      link: function(scope, element, attrs) {

        var id = attrs.id
          , width = parseInt(attrs.width, 10)
          , height = parseInt(attrs.height, 10)
          , barChart
          , fnUnwatchGoalLine
          , fnUnwatchBarIndex;
        
        scope.$watch(
          function() { return scope.config; },
          function(newVal, oldVal) {
            $log.log(newVal + ' : ' + oldVal);

            updateUi();
          }
        );

        //
        // Update UI
        //

        function updateUi() {

          if (barChart) {
            barChart.destroy();
            barChart = null;
          }

          element.html('');


          YUI().use('fe-stacked-barchart', function(Y) {

            barChart = new Y.FE.StackedBarChart(id, width, height, scope.config);
            barChart.on('rendered', onRendered);
            barChart.render();
          });
        }


        function onRendered() {

          // Goal line

          if (fnUnwatchGoalLine) {
            fnUnwatchGoalLine();
          }

          fnUnwatchGoalLine = scope.$watch('goalLine', function(newVal, oldVal) {
            $log.log(newVal + ' : ' + oldVal);

            if (scope.goalLine) {
              barChart.showHorizontalLine(0);
            }
            else {
              barChart.hideHorizontalLine(0); 
            }
          });

          // Bar index

          if (fnUnwatchBarIndex) {
            fnUnwatchBarIndex();
          }

          fnUnwatchBarIndex = scope.$watch('barIndex', function(newVal, oldVal) {
            $log.log(newVal + ' : ' + oldVal);

            barChart.showBubble(scope.barIndex);
          });


          safeApply(scope);

        } // end of onRendered

      } // end of link
    };
    
  }]);