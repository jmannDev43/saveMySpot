
var isEnabled = false;
var tabCounts = {};
var isInjected = false;

var colors = {
    grey: '#6d6d6d',
    blue: '#002957'
};

// onMessage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

    if (request.from === 'popup'){

        if (request.action === 'enable' || request.action === 'disable'){
            toggleEnabled(request);
        }

        if (request.action === 'clearSpots'){
            clearSpots();
        }

    }

    if (request.action == "inject" && !isInjected) {
        isInjected = true;
        inject();
    }

    if (request.action == 'updatePopup'){
        updatePopup(request);
    }
});

// tab events
chrome.tabs.onActivated.addListener(function (request, sender, sendResponse) {
    if (isEnabled){
        sendBackgroundMessage('appendModal');

        var spotCount = tabCounts[request.tabId];
        if (spotCount !== undefined){
            updatePopup({ text: spotCount });
        }

        // TODO: send spotCount to spot.js
    }
});

chrome.tabs.onRemoved.addListener(function (request, sender, sendResponse){
    delete tabCounts[request];
});

// handle reload
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if (tab.url !== undefined && changeInfo.url === undefined){
        updatePopup({ spotCount: 0 });
        inject();
        var isEnabled = window.localStorage.getItem('isEnabled') ? 'enable' : 'disable';
        sendBackgroundMessage(isEnabled);
    }
});

// functions
function inject(){
    // create initial mapping object for all tabs in local storage
    chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab) {
            tabCounts[tab.id] = 0;
        });
    });

    sendBackgroundMessage('appendModal');

    // Set initial spot count to 0 when extension is loaded
    updatePopup({ spotCount: 0 });

    // inject js & css
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var selectedTab = tabs[0];
        if (selectedTab){
            chrome.tabs.insertCSS(selectedTab.id, { file: "spot.css" });
            chrome.tabs.executeScript(selectedTab.id, { file: "spot.js" });
        }
    });
}

function updatePopup(request){
    if (request.spotCount !== undefined){
        var color = request.spotCount > 0 ? colors.blue : colors.grey;
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var selectedTab = tabs[0];
            if (selectedTab){
                tabCounts[selectedTab.id] = request.spotCount;
                chrome.browserAction.setBadgeText({text: request.spotCount.toString()});
                chrome.browserAction.setBadgeBackgroundColor({
                    color: color
                });
            }
        });
    }
}

function toggleEnabled(request) {
    isEnabled = request.action === 'enable';
    // store in local storage so it can be reset on reload
    window.localStorage.setItem('isEnabled', isEnabled);
    sendBackgroundMessage(request.action);
}

function clearSpots(){
    updatePopup({ spotCount: 0 });
    sendBackgroundMessage('clearSpots');
}

function sendBackgroundMessage(action) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: action, from: 'background'}, function(response) {});
    });
}
