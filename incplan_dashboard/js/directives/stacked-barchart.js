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
        
        // Update UI whenever config is re-assigned or initialized.
        scope.$watch(
          function() { return scope.config; },
          function(newVal, oldVal) {
            $log.log('config: ' + newVal + ' to ' + oldVal);

            updateUi();
          }
        );

        //
        // Update UI
        //

        function updateUi() {

          $log.log('updateUi');

          // Destroy previously constructed bar chart.
          if (barChart) {
            barChart.destroy();
            barChart = null;
          }

          // Stop obsolete listeners
          if (fnUnwatchGoalLine) {
            fnUnwatchGoalLine();
          }
          if (fnUnwatchBarIndex) {
            fnUnwatchBarIndex();
          }

          element.html('');


          YUI().use('fe-stacked-barchart', function(Y) {

            barChart = new Y.FE.StackedBarChart(id, width, height, scope.config);
            barChart.on('rendered', onRendered);

            // Update barIndex when user selects a bar.
            barChart.on('barClick', function(e) {
              safeApply(scope, function() {
                scope.barIndex = e.barIndex;
              })
            });

            barChart.render();
          });
        }


        function onRendered() {

          $log.log('onRendered');

          // Toggal goal line when goalLine changes.
          fnUnwatchGoalLine = scope.$watch('goalLine', function(newVal, oldVal) {
            $log.log('goalLine: ' + oldVal + ' to ' + newVal);

            if (scope.goalLine) {
              barChart.showHorizontalLine(0);
            }
            else {
              barChart.hideHorizontalLine(0); 
            }
          });

          // Show bubble when barIndex changes.
          fnUnwatchBarIndex = scope.$watch('barIndex', function(newVal, oldVal) {
            $log.log('barIndex: ' + oldVal + ' to ' + newVal);

            barChart.showBubble(scope.barIndex);
          });


          safeApply(scope);

        } // end of onRendered

      } // end of link
    };
    
  }]);