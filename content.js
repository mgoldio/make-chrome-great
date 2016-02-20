window.plot = function(img, x, y, w, h) {
  var trump=document.createElement('img');
  trump.src =chrome.extension.getURL('trump_cutouts/trump_cutout01.png');
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

$.each($("img"),function(index, img){
  var tracker = new tracking.ObjectTracker(['face']);
  tracker.setStepSize(1.7);

  tracking.track(img, tracker);
  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      window.plot(img, rect.x, rect.y, rect.width, rect.height);
    });
  });    
});
//chrome.runtime.sendMessage({"message": "send_photo", "photos": photos});
