var toggle = true;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "icon.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {file:"trumpify.js"});
    chrome.browserAction.enable(tab.id);
  }
  else{
    chrome.browserAction.setIcon({path: "iconOff.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {file:"untrumpify.js"});
    /*chrome.browserAction.disable(tab.id);*/
  }
});