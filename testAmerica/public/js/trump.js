window.onload = function() {
  var tracker = new tracking.ObjectTracker(['face']);
  tracker.setStepSize(1.7);

  // Trumpify every image on the page
  $('img').each(function(i, img){
    tracking.track(img, tracker);
    tracker.on('track', function(event) {
      event.data.forEach(function(rect) {
        window.plot(img, rect.x, rect.y, rect.width, rect.height);
      });
    });    
  });

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

};
