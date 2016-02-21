function isOnScreen(elem) {
  return ($(elem).offset().top) < ($(window).height() + $(window).scrollTop());
}

window.overlayTrump = function(img, x, y, w, h) {
  var trump=document.createElement("img");
  $(trump).attr("isTrumpified", "true");
  trump.src =chrome.extension.getURL("trump_cutouts/trump_cutout01.png");
  trump.style.width = 2*w + "px";
  trump.style.height = 2*h + "px";
  trump.style.position = "absolute";
  trump.style.top = y - .5*h + "px";
  trump.style.left = x - .5*w + "px";

  var wrapper = document.createElement("div");
  wrapper.className = "trumpWrapper";
  wrapper.style.position = "relative";
  img.parentElement.insertBefore(wrapper, img);
  img.parentElement.removeChild(img);

  wrapper.appendChild(img);
  wrapper.appendChild(trump);
};

window.trumpify = function(img) {
  $(img).faceDetection({
    complete: function (faces) {
      $.each(faces, function(index, face){
        window.overlayTrump(img, face.x, face.y, face.width, face.height);
      });
    }
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

