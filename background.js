//do facial recognition, choose trump face

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "send_photo" ) {
      var photos = request.photos;
    }
  }
);
