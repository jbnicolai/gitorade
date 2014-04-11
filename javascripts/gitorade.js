window.addEventListener('load', function () {
  var urlParams = {};
  location.search.slice(1).split('&').forEach(function (param) {
    current = param.split('=', 2);
    urlParams[decodeURIComponent(current[0])] = decodeURIComponent(current[1]);
  });

  Gitorade.load(urlParams);
}, false);

var Gitorade = {
  load: function (params) {
    var action = document.querySelector('#github_issue_create'),
        canvas = document.querySelector('#canvas');

    canvas.setAttribute('height', (window.innerHeight * 0.8) + 'px');
    canvas.setAttribute('width', window.innerWidth + 'px');

    this.formatImg = new GithubCanvas(canvas);
  },

  setScreenShot: function (img, id) {
    window.sessionStorage.setItem('gh-issue-img-' + id, img);
    if (this.formatImg) {
      this.formatImg.setBackground(img);
     }
  },

  setHostURL: function (url, id) {
    window.sessionStorage.setItem('gh-issue-host-url', url);
  }
}
