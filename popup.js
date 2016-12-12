document.addEventListener('DOMContentLoaded', function() {
    console.log('dom loaded called');
    chrome.runtime.sendMessage({ action: 'inject' }, function () {
        console.log('add message sent');
    });

    $('#isEnabled').on('change', function (e) {
        var isEnabled = $(e.target).prop('checked');
        var action = isEnabled ? 'enable' : 'disable';
        chrome.runtime.sendMessage({ action: action, from: 'popup' }, function () {});
    });

    $('#clearPage').on('click', function (e) {
        console.log('clear clicked');
        chrome.runtime.sendMessage({ action: 'clearSpots', from: 'popup' }, function () {});
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