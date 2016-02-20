window.plot = function(img, x, y, w, h) {
  var trump=document.createElement('img');
  trump.src ='trump.png';
  trump.style.width = 1.1*w + "px";
  trump.style.height = 1.1*h + "px";
  trump.style.position = "absolute";
  trump.style.top = .94*y + "px";
  trump.style.left = x + "px";

  trump.onload = function () {
    var wrapper = document.createElement("div");
    img.parentElement.appendChild(wrapper);
    img.parentElement.removeChild(img);

    wrapper.appendChild(img);
    wrapper.appendChild(trump);
  }
};

//do facial recognition, choose trump face
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "send_photo" ) {
      var photos = request.photos;

      for each (var img in photos){
        var tracker = new tracking.ObjectTracker(['face']);
        tracker.setStepSize(1.7);

        tracking.track(img, tracker);
        tracker.on('track', function(event) {
          event.data.forEach(function(rect) {
            window.plot(img, rect.x, rect.y, rect.width, rect.height);
          });
        });    
      }
    }
  }
);
