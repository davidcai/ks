angular.module('app')

  .directive('listView', ['$log', function($log) {

    return {
      restrict: 'AE', 

      scope: {
        list: '='
      }, 

      template: 
        '<ol class="list-view">' + 
          '<li class="header">' + 
            '<span class="left-title">{{ list.header.leftTitle }}</span>' + 
            '<span class="right-title">{{ list.header.rightTitle }}</span>' + 
            '<span class="left-subtitle">{{ list.header.leftSubtitle }}</span>' + 
            '<span class="right-subtitle">{{ list.header.rightSubtitle }}</span>' + 
          '</li>' +
          '<li class="{{ item.itemCategory | lowercase }}" ng-repeat="item in list.items">' + 
            '<span class="legend"></span>' + 
            '<span class="left-title">{{ item.leftTitle }}</span>' + 
            '<span class="right-title">{{ item.rightTitle }}</span>' + 
            '<span class="left-subtitle">{{ item.leftSubtitle }}</span>' + 
            '<span class="right-subtitle">{{ item.rightSubtitle }}</span>' + 
          '</li>' + 
        '</ol>',

      link: function(scope, element, attrs) {
        $log.log(scope.list);

      }
    };
    
  }]);