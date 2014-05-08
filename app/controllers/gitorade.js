angular.module('Gitorade.controllers')
  .controller('GitoradeCtrl', function ($modal, $q, $rootScope, $scope, $timeout, Github, Imgur, Issue, Organization, Repository) {
    $scope.viewLoading = false;

    var issueCreated = function () {
      var modalInstance = $modal.open({
        templateUrl: 'app/templates/modals/issue-created.html',
        controller: 'IssueCreatedModalController',
        resolve: {
          issueUrl: function () {
            return $scope.issueUrl;
          }
        }
      });
    };

    var uploadImage = function (image) {
      var d = $q.defer();

      Imgur.uploadImage(toBase64(image)).then(function (response) {
        d.resolve(response.data.link);
      }, function (reason) {
        d.reject(reason);
      });

      return d.promise;
    };

    var createIssue = function (repository, title, body) {
      var deferred = $q.defer();

      uploadImage($('#canvas')[0]).then(function (response) {
        body = body.replace('[IMAGE_URL]', response);

        Issue.create(repository, title, body).then(function (response) {
          // Need cleanup. All DOM manipulation should be done with directives
          $scope.issueUrl = response.html_url;
          issueCreated();
          deferred.resolve(response);
        }, function (reason) {
          console.log('Error in Github:', reason);
          deferred.reject(response);
        });
      }, function (reason) {
        console.log('Error in Imgur:', reason);
        deferred.reject(response);
      });

      return deferred.promise;
    };

    $scope.$on('Github.user.authenticated', function () {
      Organization.all().then(function (organizations) {
        var userRepositories = [Repository.all()];
        var organizationRepositories = organizations.map(function (organization) {
          return Repository.byOrganization(organization.login);
        });

        var repositories = userRepositories.concat(organizationRepositories);

        $q.all(repositories).then(function (responses) {
          $scope.repositories = responses.reduce(function (a, b) {
            return a.concat(b);
          });
        }, function (reasons) {
          var keys = ['all', 'byOrganization'];

          for (var i = 0; i < reasons.length; ++i) {
            if (reasons[i].hasOwnProperty('err') && reasons[i].err) {
              console.log('Error:', keys[i]);
            }
          }
        });
      }, function (reason) {
        console.log('Error with getUserOrganizations:', reason);
      });
    });

    $scope.submitIssue = function () {
      $scope.viewLoading = true;

      var repository = $('#issue-repository option:selected').text(),
          submitter = document.querySelector('#issue-submitter').value,
          description = document.querySelector('#issue-description').value,
          content = document.querySelector('#issue-content').value,
          url = window.sessionStorage.getItem('gh-issue-host-url'),
          date = new Date();

      var markdown = '' +
        '**Submitter**: ' + submitter + '\n\n' +
        '**Description**: ' + description + '\n\n' +
        '**Detail:**' + '\n\n' + content + '\n\n' +
        '**Screenshot URL**: ' + url + '\n\n' +
        '**Screenshot:** ![Gitorade]([IMAGE_URL])';

      window.sessionStorage.removeItem('gh-issue-host-url');

      createIssue(repository, description, markdown).then(function (response) {
        $scope.viewLoading = false;
      }, function (reason) {
        $scope.viewLoading = false;
      });
    };
  });
