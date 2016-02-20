
  window.plot = function(img, x, y, w, h) {
    var trump=document.createElement('img');
    trump.src ='trump.png';
    trump.style.width = 2*w + "px";
    trump.style.height = 2*h + "px";
    trump.style.position = "absolute";
    trump.style.top = y - .5*h + "px";
    trump.style.left = x - .5*w + "px";

    trump.onload = function () {
      var wrapper = document.createElement("div");
      img.parentElement.appendChild(wrapper);
      img.parentElement.removeChild(img);

      wrapper.appendChild(img);
      wrapper.appendChild(trump);
    }
  };

window.onload = function() {
  // Trumpify every image on the page
  $('img').each(function(i, img){
    $(img).faceDetection({
      complete: function (faces) {
        $.each(faces, function(index, face){
          window.plot(img, face.x, face.y, face.width, face.height);
        });
      },
      asynch: true
    });
  });


};
