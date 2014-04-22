angular.module('app')
  .directive('itemList', function() {

    return {
      restrict: 'AE',
      scope: {
        items: '=',
        filterBy: '=',
        orderBy: '='
      },
      template:
        '<li ng-repeat="item in items | filter: { text: filterBy } | orderBy: orderBy">' +
          '<input type="checkbox" id="item{{$index}}" ng-model="item.completed">' +
          '<label for="item{{$index}}" ng-class="{ \'completed\': item.completed }">{{ item.text }}</label>' +
        '</li>'
    };
  }); // end of directive itemList