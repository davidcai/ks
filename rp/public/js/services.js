angular.module('app.services', [])

  .factory('storyService', ['$http', '$log', function($http, $log) {
    return {
      findById: function(id) {
        return $http({ method: 'GET', url: '/stories/' + id });
      }, 

      groupByTeams: function() {
        return $http({ method: 'GET', url: '/stories/', params: { groupBy: 'teams'} });
      }, 

      groupByInitiatives: function() {
        return $http({ method: 'GET', url: '/stories/', params: { groupBy: 'initiatives'} });
      }, 

      groupByThemes: function() {
        return $http({ method: 'GET', url: '/stories/', params: { groupBy: 'themes'} });
      }
    }
  }]);