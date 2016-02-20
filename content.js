window.overlayTrump = function(img, x, y, w, h) {
  var trump=document.createElement('img');
  trump.src =chrome.extension.getURL('trump_cutouts/trump_cutout01.png');
  trump.style.width = 1.1*w + "px";
  trump.style.height = 1.1*h + "px";
  trump.style.position = "absolute";
  trump.style.top = .94*y + "px";
  trump.style.left = x + "px";

  trump.onload = function () {
    var wrapper = document.createElement("div");
    wrapper.class = "trumpWrapper";
    wrapper.style.position = "relative";
    img.parentElement.appendChild(wrapper);
    img.parentElement.removeChild(img);

    wrapper.appendChild(img);
    wrapper.appendChild(trump);
  }
};

window.trumpify = function(img) {
  var tracker = new tracking.ObjectTracker(['face']);
  tracker.setStepSize(1.7);

  tracking.track(img, tracker);
  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      window.overlayTrump(img, rect.x, rect.y, rect.width, rect.height);
    });
  });
};

$(document).ready(function(){
  $.each($("img"),function(index, img){
    window.trumpify(img);
  });

  $(document).bind('DOMNodeInserted',function(e){
    if ($(e.target).is("img")){
      // Not already trump
      if($(e.target).parent(".trumpWrapper").size == 0) {
        debugger;
        window.trumpify(e.target);
      }
    }
  });
});


//chrome.runtime.sendMessage({"message": "send_photo", "photos": photos});
