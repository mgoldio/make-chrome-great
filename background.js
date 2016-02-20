self.addEventListener('message', function(e) {
  // Process image data
  var src = e.data.src;
  var width = e.data.width;
  var height = e.data.height;
  
  self.postMessage(e.data);
}, false);
