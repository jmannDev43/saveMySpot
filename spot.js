spotCounter = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.from === 'background'){
        switch (request.action){
            case 'enable':
                addHandlers();
                break;
            case 'disable':
                removeHandlers();
                break;
            case 'clearSpots':
                clearSpots();
                break;
            case 'appendModal':
                appendModal();
                break;
        }
    }
});

function clearSpots() {
    $('.savedSpot').remove();
    spotCounter = 0;
}

function addHandlers() {
    document.body.addEventListener('dblclick', saveSpot, false);
    document.body.addEventListener('keyup', onKeyup, false);
}

function removeHandlers() {
    document.body.removeEventListener('dblclick', saveSpot, false);
    document.body.removeEventListener('keyup', onKeyup, false);
}

function saveSpot(e) {
    // TODO: ensure bug where counts skip by 2 isn't occurring
    var colors = ["#626677", "#041613", "#3c3d37", "#cc1099", "#6dad7f", "#cee0d6", "#44562a", "#2cb26f", "#72a530", "#bc1e6a", "#4f3832", "#1b121e", "#d11d8c", "#561e43", "#006649", "#725e5e", "#eea7f9", "#21200e", "#82317e", "#040333", "#bafcc0", "#82d2d8", "#f7d033", "#13af71", "#070505", "#020000", "#725a41", "#843365", "#0f0811", "#1b997f", "#3d223f", "#d666ad", "#e0c4a6", "#7f1f6d", "#a3a3a3", "#718e47", "#4f1d24", "#697499", "#e293c1", "#4740f9", "#040503", "#07bf60", "#0f0a0a", "#779b29", "#382d49", "#d19eef", "#0f2154", "#13140e", "#6c17a5", "#929b41"];
    var bgColorStyle = 'background-color: ' + colors[spotCounter] + '; ';
    spotCounter++; // TODO: Check spotCounter functionality

    var top = 'top: ' + e.pageY + 'px; ';
    var left = 'left: ' + e.pageX + 'px; ';

    $('body').append('<a style="position: absolute; color: white; opacity: 0.4; ' + top + left + bgColorStyle + '" class="savedSpot" id="savedSpot' + spotCounter + ' ">' + spotCounter + '</a>');

    chrome.runtime.sendMessage({ action: 'updatePopup', from: 'content', spotCount: spotCounter });
}

function onKeyup(e) {
    if (e.ctrlKey && e.keyCode === 76) {
        $('#enterSpotModal').show();
        $('#spotNumber').focus();
    }
    // TODO: Wire up keyup event on enter (hide modal, animate scroll)
    // TODO: validation (if no # entered; if spot doesn't exist for #)?
    if (e.keyCode === 13) {
        var spotNumber = $('#spotNumber').val();
        if (spotNumber) {
            $('#enterSpotModal').hide();

        }
    }

    if (e.keyCode === 27){
        $('#enterSpotModal').hide();
    }
    // TODO: window resize handler?
}

// TODO: Add X symbol on spots with onClick to remove
function removeSpot(e) {
    console.log('remove', e);
}

function appendModal(){
    if ($('#enterSpotModal').length === 0){
        var top = (window.innerHeight / 2) + $('body').scrollTop() - 60;
        var topStyle = 'top: ' + top + 'px; ';
        var left = (window.innerWidth / 2) - 100;
        var leftStyle = 'left: ' + left + 'px;';
        var spotModal = '\
        <div id="enterSpotModal" style="position: absolute; display: none; color: white; ' + topStyle + leftStyle + '"> \
            <input placeholder="Enter Spot # (then Enter)" id="spotNumber" type="text"> \
        </div>';

        $('body').append(spotModal);
    }
}