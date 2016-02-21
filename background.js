// credit to http://stackoverflow.com/questions/18740932/disable-enable-chrome-extension-via-browser-action-icon/18788972#18788972
function disableExtension(disabled, tab)
{
  chrome.tabs.sendMessage(tab.id, {
    message: {"disabled" : disabled}
  });
};


var toggle = true;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "icon.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {file:"trumpify.js"});
    chrome.browserAction.enable(tab.id);
    disableExtension(false, tab);
  }
  else{
    chrome.browserAction.setIcon({path: "iconOff.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {file:"untrumpify.js"});
    disableExtension(true, tab);
    /*chrome.browserAction.disable(tab.id);*/
  }
});

