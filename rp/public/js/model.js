angular.module('model', ['ngResource'])

  .factory('Story', ['$resource', function($resource) {
    return $resource('/stories/:storyId', {storyId: '@id'});
  }]);