var debug = false;

document.addEventListener('DOMContentLoaded', function() {
    debug && console.log('sending inject message');
    chrome.runtime.sendMessage({ action: 'inject' }, function () {
        debug && console.log('inject message sent');
    });

    $('#isEnabled').on('change', function (e) {
        var isEnabled = $(e.target).prop('checked');
        var action = isEnabled ? 'enable' : 'disable';
        debug && console.log('sending enabled change message');
        chrome.runtime.sendMessage({ action: action, from: 'popup' }, function () {
            debug && console.log(action + ' message sent');
        });
    });

    $('#clearPage').on('click', function (e) {
        chrome.runtime.sendMessage({ action: 'clearSpots', from: 'popup' }, function () {
            debug && console.log('clearSpots message sent');
        });
    });
});

// http://stackoverflow.com/questions/21621666/chrome-extension-popup-resets-even-after-changing-its-contents
chrome.runtime.getBackgroundPage(function(bg){
    if(bg.isEnabled !== undefined){
        $('#isEnabled').prop('checked', bg.isEnabled);
    }
    setInterval(function(){
        bg.isEnabled = $('#isEnabled').prop('checked');
    },1000);
})