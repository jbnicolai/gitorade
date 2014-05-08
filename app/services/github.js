angular.module('Github')
  .provider('Github', function () {
    var that = this;

    this.ACCESS_TOKEN = '';
    this.API_URL = 'https://api.github.com';
    this.CLIENT_ID = '';
    this.CLIENT_SECRET = '';
    this.SCOPE = '';
    this.STATE = '';

    var buildAuthURI = function () { 
      return [
        'https://github.com/login/oauth/authorize',
        '?client_id=' + that.CLIENT_ID,
        '&scope=' + that.SCOPE,
        '&state=' + that.STATE
      ].join('');
    };

    var getParameterByName = function (url, name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(url);

      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    this.setClientId = function (id) {
      if (id) this.CLIENT_ID = id;
    };

    this.setClientSecret = function (secret) {
      if (secret) this.CLIENT_SECRET = secret;
    };

    this.setScope = function (scope) {
      if (scope) this.SCOPE = scope;
    };

    this.setState = function (state) {
      if (state) this.STATE = state;
    };

    this.$get = function ($http, $q, $routeParams) {
      var self = this;

      var service = {
        user: {},

        authenticate: function () {
          var deferred = $q.defer();

          try {
            chrome.identity.launchWebAuthFlow({
              url: buildAuthURI(),
              interactive: true
            }, function (redirectUrl) {
              var code = getParameterByName(redirectUrl, 'code'),
                  state = getParameterByName(redirectUrl, 'state');

              if (state !== self.STATE) { 
                deferred.reject({
                  state: 401, 
                  error: 'State was changed during authentication.'
                });
              }

              $http.post('https://github.com/login/oauth/access_token', {
                client_id: self.CLIENT_ID, 
                client_secret: self.CLIENT_SECRET, 
                code: code
              }).success(function (response) {
                self.ACCESS_TOKEN = response.access_token;

                service.getAuthenticatedUser().then(function (response) {
                  service.user = response;
                  deferred.resolve(response);
                });
              }).error(function (reason) {
                deferred.reject(reason);
              });
            });
          } catch (e) {
            deferred.reject(reason);
          }

          return deferred.promise;
        },

        getAccessToken: function () {
          if (self.ACCESS_TOKEN) return self.ACCESS_TOKEN;
        },

        getAuthenticatedUser: function () {
          var github_endpoint_url = [self.API_URL, 'user'].join('/');
          var deferred = $q.defer();

          $http.get(github_endpoint_url, {
            params: { access_token: self.ACCESS_TOKEN }
          }).success(function (response) {
            deferred.resolve(response);
          }).error(function (reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        },

        isAuthenticated: function () {
          return service.user.hasOwnProperty('login') && service.user.login;
        }
      };

      return service;
    };
  });