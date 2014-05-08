angular.module('Github.repository')
  .factory('Repository', function ($http, $q, Github) {
    var API_BASE_URL = 'https://api.github.com/user/repos';

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
      },

      byOrganization: function (organization) {
        var API_BASE_URL = 'http://api.github.com';
        var endpoint = [ 
          API_BASE_URL, 'orgs', organization, 'repos' 
        ].join('/');
        var deferred = $q.defer();

        $http.get(endpoint, {
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