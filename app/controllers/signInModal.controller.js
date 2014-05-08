angular.module('Gitorade.controllers')
	.controller('SignInModalController', function ($modalInstance, $rootScope, $scope, Github) {
		$scope.signIn = function () {
      Github.authenticate().then(function (response) {
        $rootScope.$broadcast('Github.user.authenticated');
        $modalInstance.close();
      });
    };

    $scope.close = function () {
      chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.remove(tab.id);
      });
    };
	});