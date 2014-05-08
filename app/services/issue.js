angular.module('Github.issue')
  .factory('Issue', function ($http, $q, Github) {
    var API_BASE_URL = 'https://api.github.com/repos';

    return {
      create: function (repository, title, body) {
        var endpoint = [ API_BASE_URL, repository, 'issues' ].join('/');
        var deferred = $q.defer();

        $http.post(endpoint, {
          title: title, body: body, labels: ['gitorade']
        }, {
          params: { access_token: Github.getAccessToken() }
        }).success(function (response) {
          deferred.resolve(response);
        }).error(function (reason) {
          deferred.reject(reason);
        });

        return deferred.promise;
      }
    };
  });