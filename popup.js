document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({ action: 'inject' }, function () {
        console.log('add message sent');
    });
});
