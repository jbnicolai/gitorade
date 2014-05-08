var id = 100;

/*chrome.app.runtime.onLaunched.addListener(function(launchData) {
  try {
    chrome.identity.launchWebAuthFlow({
      url: 'http://github.com/login/oauth/authorize?client_id=cc970f3f3857ed84831e&scope=repo,gist&state=gitorade',
      interactive: true
    }, function (redirect_url) {
      alert(redirect_url);
    });
  } catch (e) {
    console.log(e);
  }
});*/

chrome.browserAction.onClicked.addListener(function (tab) {
  var hostURL = tab.url;
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    var currentId = id++;
    var viewTabUrl = chrome.extension.getURL('gitorade.html?id=' + currentId);
    chrome.tabs.create({ url: viewTabUrl }, function (tab) { 
      var targetId = tab.id;
      var addSnapshotImageToTab = function (tabId, changedProps) {
        if (tabId != targetId || changedProps.status != 'complete') {
          return;
        }

        chrome.tabs.onUpdated.removeListener(addSnapshotImageToTab);
        var views = chrome.extension.getViews();
        for (var i  = 0; i < views.length; ++i) {
          var view = views[i];
          if (view.location.href == viewTabUrl) {
            view.Gitorade.setScreenShot(screenshotUrl, currentId);
            view.Gitorade.setHostURL(hostURL, currentId);
            break;
          }
        }
      };

      chrome.tabs.onUpdated.addListener(addSnapshotImageToTab);
    });
  });
});
