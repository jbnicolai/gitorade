angular.module('Gitorade.directives')
	.directive('loadingSpinner', function () {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
        loading: '=loadingSpinner'
      },
      templateUrl: 'app/templates/loading-spinner.html',
      link: function (scope, element, attrs) {
        var spinner = new Spinner().spin();
        var container = document.querySelector('#loading-spinner-overlay');
        container.appendChild(spinner.el);
      }
    };
  });