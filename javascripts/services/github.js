angular.module('Gitorade.services')
  .provider('Github', function () {
    var that = this;

    this.GITHUB_API_HOST = 'https://api.github.com';
    this.GITHUB_ACCESS_TOKEN = '3c4a92df3566d7faf3afc4cd22f18ae534f71a9f';

    return {
      $get: function ($cacheFactory, $http, $q) {
        var self = this;

        var cache = $cacheFactory.get('github_cache') || $cacheFactory('github_cache');

        return {
          createIssue: function (token, repository, title, body) {
            var github_endpoint_url = [
              that.GITHUB_API_HOST, 'repos', repository, 'issues'
            ].join('/');

            var deferred = $q.defer();

            $http.post(github_endpoint_url, {
              title: title, body: body,
            }, {
              params: { access_token: token }
            }).success(function (response) {
              deferred.resolve(response);
            }).error(function (response) {
              deferred.reject(response);
            });

            return deferred.promise;
          }, 

          getAuthenticatedUser: function (token) {
            var github_endpoint_url = [that.GITHUB_API_HOST, 'user'].join('/');
            var deferred = $q.defer();

            $http.get(github_endpoint_url, {
              params: { access_token: token }
            }).success(function (response) {
              cache.put('user', response);
              deferred.resolve(response);
            }).error(function (response) {
              deferred.reject(response);
            });

            return deferred.promise;
          },

          getUserRepositories: function (token) {
            var github_endpoint_url = [that.GITHUB_API_HOST, 'user', 'repos'].join('/');
            var deferred = $q.defer();

            $http.get(github_endpoint_url, {
              params: { access_token: token }
            }).success(function (response) {
              deferred.resolve(response);
            }).error(function (response) {
              deferred.reject(response);
            });

            return deferred.promise;
          }
        }
      }
    };
  });