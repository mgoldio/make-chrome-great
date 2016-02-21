function isOnScreen(elem) {
  return ($(elem).offset().top) < ($(window).height() + $(window).scrollTop());
}

window.overlayTrump = function(img, x, y, w, h) {
  var trump = document.createElement("img");
  var rando = Math.floor(Math.random() * 10000000000);
  switch (rando%3) {
    case 0:
    trump.src = chrome.extension.getURL('trump_cutouts/trump_cutout01.png');
    break;
    case 1:
    trump.src = chrome.extension.getURL('trump_cutouts/trump_cutout06.png');
    break;
    case 2:
    trump.src = chrome.extension.getURL('trump_cutouts/trump_cutout06.png');
    break;
  }
  $(trump).attr("isTrumpified", "true");
  $(trump).addClass("trump");
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
            $(img).attr("isTrumpified", "true");

            $.each(faces, function(index, face){
              var widthratio = img.width/img.naturalWidth;
              var heightratio = img.height/img.naturalHeight;
              var x, y, w, h;
              x = widthratio * face.x;
              y = heightratio * face.y;
              w = widthratio * face.width;
              h  = heightratio * face.height;
              if (h > w || w > h) {
                //debugger;
              }

              if ((h/w) > 1.1) {
                h = 1.1 * w;
              }

              if ((w/h) > 1.1) {
                w = 1.1 * h;
              }

              window.overlayTrump(img, x, y, w, h);
            });
          },
        });
      }
    }
  } catch(e) {
    console.log(e);
  }
};

window.randomTrumpPictureUrl = function() {
  var rnd = Math.floor(Math.random() * 10);
  return chrome.extension.getURL("trump_pics/"+rnd + ".jpg");  
}

window.trumpifyEventually = function(img, tries) {
  if (tries > 8) {
    img.src = window.randomTrumpPictureUrl();
    $(img).addClass("trump");
    $(img).attr("isTrumpified", "true");
  } else {
    if ($(img).attr("isTrumpified") != "true") {
      window.trumpify(img);
      var timeout = setTimeout(window.trumpifyEventually, 500, img, tries+1);
    }
  }
}

$(document).ready(function(){
  $.getJSON(chrome.extension.getURL("replacements.json"), function(r) {
    var textElems = ["a", "title", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "li"];
    for(var j = 0; j < textElems.length; j++) {
      var type = textElems[j];
      $(type).each(function(index, elem) {
        var text = $(elem).html();
        if(text.indexOf("<") !== -1)
          return;
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
    if(($(img).attr("trumpInWaiting") != "true") && isOnScreen(img)) {
      $(img).attr("trumpInWaiting", "true");
      window.trumpifyEventually(img, 0);
    }
  });

  $(document).bind("scroll", function(e){
    $.each($("img"), function(index, img) {
      if(($(img).attr("isTrumpified") != "true") && isOnScreen(img)) {
        try {
        window.trumpify(img);
        $(img).attr("isTrumpified", "true");
        }
        catch (e) {
          console.log(e);
        }
      if(($(img).attr("trumpInWaiting") != "true") && isOnScreen(img)) {
        $(img).attr("trumpInWaiting", "true");
        window.trumpifyEventually(img, 0);
        }
      }
    });
  });
});
