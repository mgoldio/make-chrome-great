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
  $.getJSON(chrome.extension.getURL('replacements.json'), function(r) {
    var textElems = ["a", "title", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "li"];
    for(var j = 0; j < textElems.length; j++) {
      var type = textElems[j];
      $(type).each(function(index, elem) {
        var text = $(elem).html();
        var djt = text;
        for(var i = 0; i < r.length; i++) {
          var repl = r[i];
          djt = djt.replace(new RegExp(repl.word, "g"), 
            repl.replacements[Math.floor(Math.random() 
            * repl.replacements.length)]);
        }
        if(djt != text)
          $(elem).html(djt);
      });
    }
  });

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

