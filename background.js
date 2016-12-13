
var isEnabled = false;
var isInjected = false;
var currentwindowId = null;
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
        init();
        inject();
    }

    if (request.action == 'updatePopup'){
        updatePopup(request);
    }
});

chrome.tabs.onCreated.addListener(function (tab) {
    newTabId = tab.id;
    updateTabCount(tab.id, 0);
})

// tab events
chrome.tabs.onActivated.addListener(function (tabInfo) {
    if (isEnabled){
        chrome.storage.local.get('tab_' + tabInfo.tabId, function (spotCount_response) {
            var spotCount = spotCount_response['tab_' + tabInfo.tabId];
            if (spotCount !== undefined && spotCount !== null){
                updatePopup({ spotCount: spotCount });
            }

            sendBackgroundMessage('appendModal');
            // TODO: send spotCount to spot.js

            chrome.storage.local.set({ 'activeTab': tabInfo.tabId });
        });
    }
});

chrome.tabs.onRemoved.addListener(function (tabId){
    chrome.storage.local.remove('tab_' + tabId, function () {});
});

// handle reload
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if (tab.url !== undefined && changeInfo.url === undefined && changeInfo.status !== 'loading'){
        updatePopup({ spotCount: 0 });
        init();
        inject();
        var isEnabled = window.localStorage.getItem('isEnabled') ? 'enable' : 'disable';
        sendBackgroundMessage(isEnabled);
    }
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId > -1){
        currentwindowId = windowId;
    }
})

// functions
function inject(){
    isInjected = true;

    // inject js & css
    chrome.tabs.query({ windowId: currentwindowId, active: true }, function (tabs) {
        var selectedTab = tabs[0];
        if (selectedTab && selectedTab.url.indexOf('chrome://') === -1){
            chrome.tabs.insertCSS(selectedTab.id, { file: "spot.css" });
            chrome.tabs.executeScript(selectedTab.id, { file: "spot.js" });
        }
    });
}

function init() {
    initializeTabCounts();
    setCurrentWindow();
    sendBackgroundMessage('appendModal');
    // Set initial spot count to 0 when extension is loaded
    updatePopup({ spotCount: 0 });
}

function initializeTabCounts(){
    // create initial mapping object for all tabs in local storage
    chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab) {
            updateTabCount(tab.id, 0);
            if (tab.active){
                chrome.storage.local.set({ 'activeTab': tab.id }, function (res) {});
            }
        });
    });
}

function setCurrentWindow() {
    chrome.windows.getCurrent(function(window) {
        currentwindowId = window.id;
    });
}

function updateTabCount(tabId, spotCount) {
    var save = {};
    save['tab_' + tabId] = spotCount;
    chrome.storage.local.set(save, function (res) {});
}

function updatePopup(request){
    if (request.spotCount !== undefined){
        var color = request.spotCount > 0 ? colors.blue : colors.grey;
        chrome.tabs.query({ windowId: currentwindowId, active: true }, function (tabs) {
            var selectedTab = tabs[0];
            if (selectedTab){
                chrome.browserAction.setBadgeText({text: request.spotCount.toString()});
                chrome.browserAction.setBadgeBackgroundColor({
                    color: color
                });

                if (request.updateStorage){
                    updateTabCount(selectedTab.id, request.spotCount);
                }
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
    chrome.tabs.query({ active: true, windowId: currentwindowId }, function(tabs){
        var selectedTab = tabs[0];
        if (selectedTab){
            chrome.tabs.sendMessage(selectedTab.id, {action: action, from: 'background'}, function(response) {});
        }
    });
}
