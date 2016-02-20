function isOnScreen(elem) {
  return ($(elem).offset().top) < ($(window).height() + $(window).scrollTop());
}

window.overlayTrump = function(img, x, y, w, h) {
  var trump=document.createElement("img");
  $(trump).attr("isTrumpified", "true");
  trump.src =chrome.extension.getURL("trump_cutouts/trump_cutout01.png");
  trump.style.width = 1.1*w + "px";
  trump.style.height = 1.1*h + "px";
  trump.style.position = "absolute";
  trump.style.top = .94*y + "px";
  trump.style.left = x + "px";

  var wrapper = document.createElement("div");
  wrapper.className = "trumpWrapper";
  wrapper.style.position = "relative";
  img.parentElement.insertBefore(wrapper, img);
  img.parentElement.removeChild(img);

  wrapper.appendChild(img);
  wrapper.appendChild(trump);
};

window.trumpify = function(img) {
  var tracker = new tracking.ObjectTracker(["face"]);
  tracker.setStepSize(.5);

  tracking.track(img, tracker);
  tracker.on("track", function(event) {
    event.data.forEach(function(rect) {
      window.overlayTrump(img, rect.x, rect.y, rect.width, rect.height);
    });
  });
};

$(document).ready(function(){
  $.each($("img"),function(index, img){
    if(($(img).attr("isTrumpified") != "true") && isOnScreen(img)) {
      $(img).attr("isTrumpified", "true");
      window.trumpify(img);
    }
  });

  $(document).bind("scroll", function(e){
    $.each($("img"), function(index, img) {
      if(($(img).attr("isTrumpified") != "true") && isOnScreen(img)) {
        $(img).attr("isTrumpified", "true");
        window.trumpify(img);
      }
    });
  });
});

