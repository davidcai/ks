angular.module('app')

  .directive('waitState', ['$log', function($log) {

    return {
      restrict: 'AE', 
      template: 
        '<div class="wait-state-content" ng-transclude>' + 
        '</div>', 
      transclude: true, 
      scope: {
        'when': '='
      }, 

      link: function(scope, element, attrs) {

        var elementCls = 'wait-state'
          , parent = element.parent()
          , parentPosition = parent.css('position')
          , parentCls = 'wait-state-container'
          , parentRelativeCls = 'wait-state-container-relative'
          , hideCls = 'wait-state-hidden';

        element.addClass(elementCls);

        parent.addClass(parentCls);
        if (parentPosition != 'absolute' || parentPosition != 'relative') {
          parent.addClass(parentRelativeCls);
        }

        scope.$watch('when', function(newVal, oldVal) {
          $log.log('scope.when: ' + oldVal + ' to ' + newVal);

          if (scope.when === true) {
            parent.children().addClass(hideCls);
            element.removeClass(hideCls);
            element.css('display', 'block');
          }
          else {
            parent.children().removeClass(hideCls);
            element.css('display', 'none');
          }
        });

      } // end of link
    };
  }]);