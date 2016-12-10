
(function(){
    spotCounter = 0;
    document.body.addEventListener('dblclick', saveSpot, false);
    document.body.addEventListener('keyup', function (e) {
        console.log(e);
        // TODO: Wire up keyup event to show modal
        // TODO: Wire up keyup event on enter (hide modal, animate scroll)
    });
})();

function saveSpot(e) {

    var colors = ["#626677", "#041613", "#3c3d37", "#cc1099", "#6dad7f", "#cee0d6", "#44562a", "#2cb26f", "#72a530", "#bc1e6a", "#4f3832", "#1b121e", "#d11d8c", "#561e43", "#006649", "#725e5e", "#eea7f9", "#21200e", "#82317e", "#040333", "#bafcc0", "#82d2d8", "#f7d033", "#13af71", "#070505", "#020000", "#725a41", "#843365", "#0f0811", "#1b997f", "#3d223f", "#d666ad", "#e0c4a6", "#7f1f6d", "#a3a3a3", "#718e47", "#4f1d24", "#697499", "#e293c1", "#4740f9", "#040503", "#07bf60", "#0f0a0a", "#779b29", "#382d49", "#d19eef", "#0f2154", "#13140e", "#6c17a5", "#929b41"];
    var bgColorStyle = 'background-color: ' + colors[spotCounter] + '; ';
    spotCounter++; // TODO: Check spotCounter functionality

    var top = 'top: ' + e.pageY + 'px; ';
    var left = 'left: ' + e.pageX + 'px; ';

    $('body').append('<a style="position: absolute; color: white; opacity: 0.4; ' + top + left + bgColorStyle + '" class="spot" id="spot' + spotCounter + ' ">' + spotCounter + '</a>');

    chrome.runtime.sendMessage({ action: 'updatePopup', from: 'content', spotCount: spotCounter });
}

// TODO: Add X simple on spots with onClick to remove
function removeSpot(e) {
    console.log('remove', e);
}
