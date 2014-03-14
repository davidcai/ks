angular.module('app')

  .directive('listView', ['$log', function($log) {

    return {
      restrict: 'A', 

      scope: {
        list: '='
      }, 

      template: 
        '<li class="header">' + 
          '<span class="left-title">{{ list.header.leftTitle }}</span>' + 
          '<span class="right-title">{{ list.header.rightTitle }}</span>' + 
          '<span class="left-subtitle">{{ list.header.leftSubtitle }}</span>' + 
          '<span class="right-subtitle">{{ list.header.rightSubtitle }}</span>' + 
        '</li>' +
        '<li class="item" ng-repeat="item in list.items">' + 
          '<span class="left-title">{{ item.leftTitle }}</span>' + 
          '<span class="right-title">{{ item.rightTitle }}</span>' + 
          '<span class="left-subtitle">{{ item.leftSubtitle }}</span>' + 
          '<span class="right-subtitle">{{ item.rightSubtitle }}</span>' + 
        '</li>',

      link: function(scope, element, attrs) {
        $log.log(scope.list);

      }
    };
    
  }]);