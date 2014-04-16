String.prototype.supplant = function (str) {
  return this.replace(/{([^{}]*)}/g, function (a, b) {
    var r = str[b];

    return typeof r === 'string' || typeof r === 'number' ? r : a;
  });
}

angular.module('Gitorade.controllers')
  .controller('GitoradeCtrl', function ($q, $rootScope, $scope, $timeout, Github, Imgur) {
    $scope.accessToken = window.localStorage.getItem('github_access_token');

    var createIssue = function (token, repository, title, body) {
      if (window.localStorage.getItem('github_access_token')) {
        var base64 = $('#canvas')[0].toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
        var imageURL = Imgur.uploadImage(base64);

        imageURL.then(function (data) {
          imageURL = data.data.link;

          var issue = Github.createIssue(token, repository, title, body.replace('[IMAGE_URL]', imageURL));

          issue.then(function (data) {
            $('#spin-overlay').css('display', 'none');
            $scope.spinner.stop();
            $scope.issueURL = data.html_url;
            $('#submitIssueSuccessModal').modal();
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
    };

    var getAuthenticatedUser = function (token) {
      $scope.user = Github.getAuthenticatedUser(token);

      $scope.user.then(function (data) {
        $scope.user = data;

        getUserRepositories(token);
      }, function (data) {
        console.log('Error: getAuthenticatedUser');
      });
    };

    var getUserRepositories = function (token) {
      Github.getUserOrganizations(token)
        .then(function (organizations) {
          var userRepositories = [Github.getUserRepositories(token)];
          var organizationRepositories = organizations.map(function (organization) {
            return Github.getOrganizationRepositories(token, organization.login);
          });

          $q.all(userRepositories.concat(organizationRepositories))
            .then(function (responses) {
              $scope.repos = responses.reduce(function (a, b) {
                return a.concat(b);
              });
            }, function (responses) {
              var keys = ['getUserRepositories', 'getOrganizationRepositories'];

              for (var i = 0; i < response.length; ++i) {
                if (repsonse[i].hasOwnProperty('err') && responses[i].err) {
                  console.log('Error: ' + keys[i]);
                }
              }
            });
        }, function (data) {
          console.log('Error: getUserOrganizations');
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
      var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: ($('#spin-overlay').height() / 2) + 'px', // Top position relative to parent in px
        left: ($('#spin-overlay').width() / 2) + 'px' // Left position relative to parent in px
      };
      var target = document.getElementById('spin-overlay');
      $scope.spinner = new Spinner(opts).spin(target);

      $('#spin-overlay').css('display', 'block');

      var expected = $('#github_issue_expected').val(),
          actual = $('#github_issue_actual').val(),
          extra = $('#github_issue_extra').val(),
          submitter = $('#github_issue_submitter').val(),
          url = window.sessionStorage.getItem('gh-issue-host-url'),
          date = new Date();

      var message = "Hi, I'm {name}.\n\nWhen I use your site, what I expect to happen is {expected}, but what actually happens is that {actual}.";

      if (extra) {
        message += '\n\nNotes: {extra}';
      }

      window.sessionStorage.removeItem('gh-issue-host-url');

      createIssue(
        window.localStorage.getItem('github_access_token'),
        $('#github_issue_repo option:selected').text(),
        actual,
        [
          message.supplant({ name: submitter, expected: expected, actual: actual, extra: extra }), 
          '![Gitorade]([IMAGE_URL])', 
          'URL: ' + url
        ].join('\n\n')
      );
    });
  });
