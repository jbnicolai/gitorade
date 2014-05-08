angular.module('Gitorade.controllers')
  .controller('IssueCreatedModalController', function ($scope, $modalInstance, issueUrl) {
    $scope.issueUrl = issueUrl;

    $scope.close = function () {
      chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.remove(tab.id);
      });
    };
  });