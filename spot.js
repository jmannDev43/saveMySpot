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
    chrome.storage.local.get('activeTab', function (activeTab_Response) {
        var tabId = 'tab_' + activeTab_Response.activeTab;
        chrome.storage.local.get('tab_' + activeTab_Response.activeTab, function (spotCount_response) {
            var spotCount = spotCount_response[tabId];

            // var colors = ["#ffcce6", "#f226c6", "#699be5", "#42c952", "#f257e2", "#7ff9b0", "#f9b302", "#27c4b4", "#31158e", "#f7ca94", "#f4b6ab", "#e276b3", "#e8d394", "#81e5f4", "#d1f200", "#6c78dd", "#0668e0", "#1346d3", "#92f4bb", "#584ec9", "#d6c2f9", "#97e569", "#fc46b6", "#1fdbf4", "#fcf525", "#2fc9ce", "#39189b", "#fcdea1", "#b02fe2", "#83eaa0", "#f413ad", "#002b5b", "#571ac9", "#9ac4ea", "#fcaf97", "#5b81cc", "#f9a2b3", "#4e0be0", "#2fd64d", "#b2d6ff", "#b59019", "#54d894", "#e01a0f", "#abc11b", "#6869d8", "#4211a3", "#c0d668", "#120791", "#8fea8c", "#e592aa", "#6d83c6", "#04770a", "#663cc9", "#890538", "#5ef28a", "#62e066", "#afc9ed", "#985dcc", "#4ca4f7", "#d7fc97", "#4c53b2", "#9e99e5", "#5dacfc", "#d6704f", "#fce388", "#7877d8", "#88bbe8", "#204782", "#d33950", "#db8b30", "#637004", "#72c617", "#201087", "#266b93", "#c589f9", "#efaeb3", "#7cd14f", "#4fd169", "#d670ff", "#cc184e", "#e86ac8", "#7ae2d5", "#9243d3", "#ffcfc4", "#ff19b2", "#834dd6", "#d0fcae", "#8a4ab5", "#f4ff5b", "#cd3aff", "#cba2ef", "#a575d8", "#ff9e6d", "#4584b7", "#ffcfc6", "#084b66", "#1a0c99", "#e894b8"];
            // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb => _.map(colors, function(c) { var rgb = hexToRgb(c); return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.4)'; });
            var colors = ["rgba(255,204,230,0.4)", "rgba(242,38,198,0.4)", "rgba(105,155,229,0.4)", "rgba(66,201,82,0.4)", "rgba(242,87,226,0.4)", "rgba(127,249,176,0.4)", "rgba(249,179,2,0.4)", "rgba(39,196,180,0.4)", "rgba(49,21,142,0.4)", "rgba(247,202,148,0.4)", "rgba(244,182,171,0.4)", "rgba(226,118,179,0.4)", "rgba(232,211,148,0.4)", "rgba(129,229,244,0.4)", "rgba(209,242,0,0.4)", "rgba(108,120,221,0.4)", "rgba(6,104,224,0.4)", "rgba(19,70,211,0.4)", "rgba(146,244,187,0.4)", "rgba(88,78,201,0.4)", "rgba(214,194,249,0.4)", "rgba(151,229,105,0.4)", "rgba(252,70,182,0.4)", "rgba(31,219,244,0.4)", "rgba(252,245,37,0.4)", "rgba(47,201,206,0.4)", "rgba(57,24,155,0.4)", "rgba(252,222,161,0.4)", "rgba(176,47,226,0.4)", "rgba(131,234,160,0.4)", "rgba(244,19,173,0.4)", "rgba(0,43,91,0.4)", "rgba(87,26,201,0.4)", "rgba(154,196,234,0.4)", "rgba(252,175,151,0.4)", "rgba(91,129,204,0.4)", "rgba(249,162,179,0.4)", "rgba(78,11,224,0.4)", "rgba(47,214,77,0.4)", "rgba(178,214,255,0.4)", "rgba(181,144,25,0.4)", "rgba(84,216,148,0.4)", "rgba(224,26,15,0.4)", "rgba(171,193,27,0.4)", "rgba(104,105,216,0.4)", "rgba(66,17,163,0.4)", "rgba(192,214,104,0.4)", "rgba(18,7,145,0.4)", "rgba(143,234,140,0.4)", "rgba(229,146,170,0.4)", "rgba(109,131,198,0.4)", "rgba(4,119,10,0.4)", "rgba(102,60,201,0.4)", "rgba(137,5,56,0.4)", "rgba(94,242,138,0.4)", "rgba(98,224,102,0.4)", "rgba(175,201,237,0.4)", "rgba(152,93,204,0.4)", "rgba(76,164,247,0.4)", "rgba(215,252,151,0.4)", "rgba(76,83,178,0.4)", "rgba(158,153,229,0.4)", "rgba(93,172,252,0.4)", "rgba(214,112,79,0.4)", "rgba(252,227,136,0.4)", "rgba(120,119,216,0.4)", "rgba(136,187,232,0.4)", "rgba(32,71,130,0.4)", "rgba(211,57,80,0.4)", "rgba(219,139,48,0.4)", "rgba(99,112,4,0.4)", "rgba(114,198,23,0.4)", "rgba(32,16,135,0.4)", "rgba(38,107,147,0.4)", "rgba(197,137,249,0.4)", "rgba(239,174,179,0.4)", "rgba(124,209,79,0.4)", "rgba(79,209,105,0.4)", "rgba(214,112,255,0.4)", "rgba(204,24,78,0.4)", "rgba(232,106,200,0.4)", "rgba(122,226,213,0.4)", "rgba(146,67,211,0.4)", "rgba(255,207,196,0.4)", "rgba(255,25,178,0.4)", "rgba(131,77,214,0.4)", "rgba(208,252,174,0.4)", "rgba(138,74,181,0.4)", "rgba(244,255,91,0.4)", "rgba(205,58,255,0.4)", "rgba(203,162,239,0.4)", "rgba(165,117,216,0.4)", "rgba(255,158,109,0.4)", "rgba(69,132,183,0.4)", "rgba(255,207,198,0.4)", "rgba(8,75,102,0.4)", "rgba(26,12,153,0.4)", "rgba(232,148,184,0.4)"];
            var bgColorStyle = 'background: ' + colors[spotCount] + '; ';
            var top = 'top: ' + e.pageY + 'px; ';
            var left = 'left: ' + e.pageX + 'px; ';
            spotCount++;

            $('body').append('<a style="position: absolute; color: white; ' + top + left + bgColorStyle + '" class="savedSpot" id="savedSpot' + spotCount + ' ">' + spotCount + '</a>');
            chrome.runtime.sendMessage({action: 'updatePopup', updateStorage: true, from: 'content', spotCount: spotCount});
        });
    });
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