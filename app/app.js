'use strict';

angular.module('Gitorade', [
  'ngCookies',
  'ngRoute',
  'Gitorade.controllers',
  'Gitorade.directives',
  'Gitorade.services',
  'Github'
]);

angular.module('Gitorade.controllers', []);
angular.module('Gitorade.directives', ['ui.bootstrap']);
angular.module('Gitorade.services', []);

angular.module('Github', [
  'Github.issue',
  'Github.organization',
  'Github.repository'
]);

angular.module('Github.issue', []);
angular.module('Github.organization', []);
angular.module('Github.repository', []);

angular.module('Gitorade')
  .run(function ($modal, $rootScope, Github) {
    Github.getAuthenticatedUser().then(function (response) {
      $rootScope.$broadcast('Github.user.authenticated');
    }, function (reason) {
      var modalInstance = $modal.open({
        templateUrl: 'app/templates/modals/sign-in.html',
        controller: 'SignInModalController'
      });
    });
  });