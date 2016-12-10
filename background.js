
tabCounts = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

    if (request.action == "inject") {
        // create initial mapping object for all tabs in local storage
        chrome.tabs.query({}, function(tabs){
            tabs.forEach(function(tab) {
                tabCounts[tab.id] = 0;
            });
        });

        // Set initial spot count to 0 when extension is loaded
        chrome.browserAction.setBadgeText({ text: "0" });
        chrome.browserAction.setBadgeBackgroundColor({
            color: "#2b2a2b"
        });

        // inject js & css
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
           var selectedTab = tabs[0];
           chrome.tabs.insertCSS(selectedTab.id, { file: "spot.css" });
           chrome.tabs.executeScript(selectedTab.id, { file: "spot.js" });
        });
    }

    if (request.action == 'updatePopup'){
        if (request.spotCount){
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var selectedTab = tabs[0];
                if (selectedTab){
                    tabCounts[selectedTab.id] = request.spotCount;
                    chrome.browserAction.setBadgeText({text: request.spotCount.toString()});
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: "#2b2a2b"
                    });
                }
            });
        }
    }

});


chrome.tabs.onActivated.addListener(function (request, sender, sendResponse) {
    if (!$('#enterSpotModal')){
        var top = null;
        var left = null;
        var spotModal = '\
        <div id="enterSpotModal" class="hidden" style="position: absolute; color: white; ' + top + left + '"> \
            <input placeholder="Enter Spot # (then Enter)" id="spotNumber" type="text"> \
        </div>';

        $('body').append(spotModal);
    }

    var spotCount = tabCounts[request.tabId];
    chrome.browserAction.setBadgeText({ text: spotCount.toString() });
});

chrome.tabs.onRemoved.addListener(function (request, sender, sendResponse){
    delete tabCounts[request];
});