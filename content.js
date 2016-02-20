var photos = var images = document.getElementsByTagName('img');
if (photos != null) {
	alert("first photo" + photos[0];
	chrome.runtime.sendMessage({"message": "send_photo", "photos": photos});
}