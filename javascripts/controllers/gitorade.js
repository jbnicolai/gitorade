angular.module('Gitorade.controllers')
  .controller('GitoradeCtrl', function ($rootScope, $scope, $timeout, Github, Imgur, $cacheFactory) {
    var createIssue = function (token, repository, title, body) {

    };

    var getAuthenticatedUser = function () {
      $scope.user = Github.getAuthenticatedUser(token);

      $scope.user.then(function (data) {
        $scope.user = data;

        getUserRepositories();
      }, function (data) {
        console.log('Error: getAuthenticatedUser');
      });
    };

    var getUserRepositories = function () {
      $scope.repos = Github.getUserRepositories(token);

      $scope.repos.then(function (data) {
        $scope.repos = data;
      }, function (data) {
        console.log('Error: getUserRepositories');
      });
    };

    var uploadImage = function (base64) {
      var image = Imgur.uploadImage(base64);

      image.then(function (data) {
        return data.data.link;
      }, function (data) {
        console.log('Error: ');
        console.log(data);
      });
    };

    var token = window.localStorage.getItem('github_access_token');

    if (token) {
      getAuthenticatedUser(token);
    } else {
      $('#setTokenModal').modal('show');

      $('#setTokenModal .save-token').on('click', function () {
        window.localStorage.setItem('github_access_token', $('#github_access_token').val());
        getAuthenticatedUser(window.localStorage.getItem('github_access_token'));
        $('#setTokenModal').modal('hide');
      });
    }

    $('#github_issue_create').on('click', function () {
      if (window.localStorage.getItem('github_access_token')) {
        var base64 = $('#canvas')[0].toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
        var imageURL = Imgur.uploadImage(base64);

        imageURL.then(function (data) {
          imageURL = data.data.link;

          var issue = Github.createIssue(
            window.localStorage.getItem('github_access_token'),
            $('#github_issue_repo option:selected').text(),
            $('#github_issue_title').val(),
            $('#github_issue_body').val() + '![Gitorade](' + imageURL + ')'
          );

          issue.then(function (data) {
            console.log('Success!');
          }, function (data) {
            console.log('Error in Github: ');
            console.log(data);
          });
        }, function (data) {
          console.log('Error in Imgur: ');
          console.log(data);
        });
      } else {
        console.log('No Github access token available.');
      }
    });
  });