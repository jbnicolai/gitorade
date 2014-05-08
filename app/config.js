angular.module('Gitorade')
  .config(function (GithubProvider) {
    GithubProvider.setClientId('CLIENT_ID');;
    GithubProvider.setClientSecret('CLIENT_SECRET');;
    GithubProvider.setScope('repo,gist');
    GithubProvider.setState('gitorade');
  });