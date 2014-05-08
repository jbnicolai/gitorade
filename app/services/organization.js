angular.module('Github.organization')
  .factory('Organization', function ($http, $q, Github) {
    var API_BASE_URL = 'https://api.github.com/user/orgs';

    return {
      all: function () {
        var deferred = $q.defer();

        $http.get(API_BASE_URL, {
          params: { access_token: Github.getAccessToken() }
        }).success(function (response) {
          deferred.resolve(response);
        }).error(function (reason) {
          deferred.reject(reason);
        });

        return deferred.promise;
      }
    }
  });