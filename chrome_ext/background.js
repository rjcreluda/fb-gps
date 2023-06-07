chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
  const maxCount = Number( request.maxCount );
  console.log('Max count: ' + maxCount);
});