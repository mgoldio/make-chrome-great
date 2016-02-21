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
  trump.style.minHeight = 0 + "px";
  trump.style.minWidth = 0 + "px";
  
  img.parentElement.appendChild(trump);
};

 // Code taken from MatthewCrumley (http://stackoverflow.com/a/934925/298479)
function getBase64Image(img) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return canvas;

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to guess the
  // original format, but be aware the using "image/jpg" will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");
  

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

window.trumpify = function(img) {
  try {
    if(img.offsetWidth > 0 && img.offsetHeight > 0) {
      var crossImg = new Image();
      crossImg.crossOrigin = "anonymous";
      crossImg.width = img.width;
      crossImg.style.width = img.width + "px";
      crossImg.height = img.height;
      crossImg.style.height = img.height + "px";
      crossImg.src = img.src;
      crossImg.onload = function(){
        // Allow cross origin contamination
        var shittycanvas = getBase64Image(crossImg);
        $(shittycanvas).faceDetection({
          error: function (code, message) {
            window.trumpify(img);
          },
          //$("<img crossorigin='anonymous' src='"+img.src+"'></img>").faceDetection({
          complete: function (faces) {
            $.each(faces, function(index, face){
              var widthratio = img.width/img.naturalWidth;
              var heightratio = img.height/img.naturalHeight;

              var x, y, w, h;
              x = widthratio * face.x;
              y = heightratio * face.y;
              w = widthratio * face.width;
              h  = heightratio * face.height;

              if ((h/w) > 1.1) {
                debugger;
                h = 1.1 * w;
              }

              if ((w/h) > 1.1) {
                debugger;
                w = 1.1 * h;
              }

              window.overlayTrump(img, x, y, w, h);
            });
          },
        });
      }
    }
  } catch(e) {
    debugger;
    console.log(e);
  }
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

