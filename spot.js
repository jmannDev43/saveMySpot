var debug = false;

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
    if (!$('body').attr('data-has-events')){
        debug && console.log('adding handlers');
        $('body').on('dblclick', saveSpot);
        $('body').on('keyup', onKeyup);
        $('body').on('click', '.savedSpot_remove', removeSpot);
        $('body').on('mouseenter', '.savedSpot', onSpotMouseOver);
        $('body').on('mouseleave', '.savedSpot_remove', onSpotMouseOut);
        $('body').attr('data-has-events', true);
    }
}

function removeHandlers() {
    if ($('body').attr('data-has-events')){
        debug && console.log('removing handlers');
        $('body').off('dblclick', saveSpot);
        $('body').off('keyup', onKeyup);
        $('body').off('click', '.savedSpot_remove', removeSpot);
        $('body').off('mouseenter', '.savedSpot', onSpotMouseOver);
        $('body').off('mouseleave', '.savedSpot_remove', onSpotMouseOut);
        $('body').attr('data-has-events', null);
    }
}

function saveSpot(e) {
    chrome.storage.local.get('activeTab', function (activeTab_Response) {
        var tabId = 'tab_' + activeTab_Response.activeTab;
        chrome.storage.local.get('tab_' + activeTab_Response.activeTab, function (spotCount_response) {
            var spotCount = spotCount_response[tabId];
            spotCount++;

            if (!$('#savedSpot' + spotCount).length){
                // var colors = ["#699be5", "#42c952", "#f257e2", "#7ff9b0", "#f9b302", "#27c4b4", "#31158e", "#f7ca94", "#f4b6ab", "#e276b3", "#e8d394", "#81e5f4", "#d1f200", "#6c78dd", "#0668e0", "#1346d3", "#92f4bb", "#584ec9", "#d6c2f9", "#97e569", "#fc46b6", "#1fdbf4", "#fcf525", "#2fc9ce", "#39189b", "#fcdea1", "#b02fe2", "#83eaa0", "#f413ad", "#002b5b", "#571ac9", "#9ac4ea", "#fcaf97", "#5b81cc", "#f9a2b3", "#4e0be0", "#2fd64d", "#b2d6ff", "#b59019", "#54d894", "#e01a0f", "#abc11b", "#6869d8", "#4211a3", "#c0d668", "#120791", "#8fea8c", "#e592aa", "#6d83c6", "#04770a", "#663cc9", "#890538", "#5ef28a", "#62e066", "#afc9ed", "#985dcc", "#4ca4f7", "#d7fc97", "#4c53b2", "#9e99e5", "#5dacfc", "#d6704f", "#fce388", "#7877d8", "#88bbe8", "#204782", "#d33950", "#db8b30", "#637004", "#72c617", "#201087", "#266b93", "#c589f9", "#efaeb3", "#7cd14f", "#4fd169", "#d670ff", "#cc184e", "#e86ac8", "#7ae2d5", "#9243d3", "#ffcfc4", "#ff19b2", "#834dd6", "#d0fcae", "#8a4ab5", "#f4ff5b", "#cd3aff", "#cba2ef", "#a575d8", "#ff9e6d", "#4584b7", "#ffcfc6", "#084b66", "#1a0c99", "#e894b8"];
                // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb => _.map(colors, function(c) { var rgb = hexToRgb(c); return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.6)'; });
                var colors = ["dummy", "rgba(105,155,229,0.6)", "rgba(66,201,82,0.6)", "rgba(242,87,226,0.6)", "rgba(127,249,176,0.6)", "rgba(249,179,2,0.6)", "rgba(39,196,180,0.6)", "rgba(49,21,142,0.6)", "rgba(247,202,148,0.6)", "rgba(244,182,171,0.6)", "rgba(226,118,179,0.6)", "rgba(232,211,148,0.6)", "rgba(129,229,244,0.6)", "rgba(209,242,0,0.6)", "rgba(108,120,221,0.6)", "rgba(6,104,224,0.6)", "rgba(19,70,211,0.6)", "rgba(146,244,187,0.6)", "rgba(88,78,201,0.6)", "rgba(214,194,249,0.6)", "rgba(151,229,105,0.6)", "rgba(252,70,182,0.6)", "rgba(31,219,244,0.6)", "rgba(252,245,37,0.6)", "rgba(47,201,206,0.6)", "rgba(57,24,155,0.6)", "rgba(252,222,161,0.6)", "rgba(176,47,226,0.6)", "rgba(131,234,160,0.6)", "rgba(244,19,173,0.6)", "rgba(0,43,91,0.6)", "rgba(87,26,201,0.6)", "rgba(154,196,234,0.6)", "rgba(252,175,151,0.6)", "rgba(91,129,204,0.6)", "rgba(249,162,179,0.6)", "rgba(78,11,224,0.6)", "rgba(47,214,77,0.6)", "rgba(178,214,255,0.6)", "rgba(181,144,25,0.6)", "rgba(84,216,148,0.6)", "rgba(224,26,15,0.6)", "rgba(171,193,27,0.6)", "rgba(104,105,216,0.6)", "rgba(66,17,163,0.6)", "rgba(192,214,104,0.6)", "rgba(18,7,145,0.6)", "rgba(143,234,140,0.6)", "rgba(229,146,170,0.6)", "rgba(109,131,198,0.6)", "rgba(4,119,10,0.6)", "rgba(102,60,201,0.6)", "rgba(137,5,56,0.6)", "rgba(94,242,138,0.6)", "rgba(98,224,102,0.6)", "rgba(175,201,237,0.6)", "rgba(152,93,204,0.6)", "rgba(76,164,247,0.6)", "rgba(215,252,151,0.6)", "rgba(76,83,178,0.6)", "rgba(158,153,229,0.6)", "rgba(93,172,252,0.6)", "rgba(214,112,79,0.6)", "rgba(252,227,136,0.6)", "rgba(120,119,216,0.6)", "rgba(136,187,232,0.6)", "rgba(32,71,130,0.6)", "rgba(211,57,80,0.6)", "rgba(219,139,48,0.6)", "rgba(99,112,4,0.6)", "rgba(114,198,23,0.6)", "rgba(32,16,135,0.6)", "rgba(38,107,147,0.6)", "rgba(197,137,249,0.6)", "rgba(239,174,179,0.6)", "rgba(124,209,79,0.6)", "rgba(79,209,105,0.6)", "rgba(214,112,255,0.6)", "rgba(204,24,78,0.6)", "rgba(232,106,200,0.6)", "rgba(122,226,213,0.6)", "rgba(146,67,211,0.6)", "rgba(255,207,196,0.6)", "rgba(255,25,178,0.6)", "rgba(131,77,214,0.6)", "rgba(208,252,174,0.6)", "rgba(138,74,181,0.6)", "rgba(244,255,91,0.6)", "rgba(205,58,255,0.6)", "rgba(203,162,239,0.6)", "rgba(165,117,216,0.6)", "rgba(255,158,109,0.6)", "rgba(69,132,183,0.6)", "rgba(255,207,198,0.6)", "rgba(8,75,102,0.6)", "rgba(26,12,153,0.6)", "rgba(232,148,184,0.6)"];
                var bgColorStyle = 'background: ' + colors[spotCount] + '; ';
                var top = 'top: ' + e.pageY + 'px; ';
                var left = 'left: ' + e.pageX + 'px; ';

                $('body').append('<a style="position: absolute; color: white; ' + top + left + bgColorStyle + '" class="savedSpot" data-spot-number="' + spotCount + '" id="savedSpot' + spotCount + '">' + spotCount + '</a><a style="position: absolute; color: white; background-color: #ff4d52; font-size: xx-large; display: none; ' + top + left + '" class="savedSpot savedSpot_remove" data-spot-number="' + spotCount + '" id="savedSpot' + spotCount + '_remove">&#10005;</a>');
                chrome.runtime.sendMessage({action: 'updatePopup', updateStorage: true, from: 'content', spotCount: spotCount});
            }
        });
    });
}

function onKeyup(e) {
    if (e.ctrlKey && e.keyCode === 76) { // ctrl + l
        var top = (window.innerHeight / 2) + $('body').scrollTop() - 60;
        $('#enterSpotModal').css('top', top + 'px');
        $('#enterSpotModal').show('slow');
        $('#spotNumber').focus();
    }

    // TODO: validation (if no # entered; if spot doesn't exist for #)?
    if (e.keyCode === 13) { // enter
        var spotNumber = $('#spotNumber').val();
        $('#spotNumber').val('');
        var spot = $('#savedSpot' + spotNumber);
        if (spot) {
            $('#enterSpotModal').slideUp();
            var top = $(spot).offset().top;
            $('html, body').animate({ scrollTop: top }, 300);
        }
    }

    if (e.keyCode === 27){ // esc
        $('#spotNumber').val('');
        $('#enterSpotModal').slideUp();
    }
    // TODO: window resize handler?
}

function removeSpot(e) {
    var spotNumber = $(e.target).attr('data-spot-number');
    $('#savedSpot' + spotNumber).remove();
    $('#savedSpot' + spotNumber + '_remove').remove();
    var spotCount = $('.savedSpot:not(.savedSpot_remove)').length;
    chrome.runtime.sendMessage({action: 'updatePopup', updateStorage: true, from: 'content', spotCount: spotCount});
}

function onSpotMouseOver(e) {
    var spotNumber = $(e.target).attr('data-spot-number');
    $(e.target).hide();
    $('#savedSpot' + spotNumber + '_remove').show();
}

function onSpotMouseOut(e) {
    var spotNumber = $(e.target).attr('data-spot-number');
    $(e.target).hide();
    $('#savedSpot' + spotNumber).show();
}


function appendModal(){
    if ($('#enterSpotModal').length === 0){
        debug && console.log('appending modal');
        var left = (window.innerWidth / 2) - 100;
        var leftStyle = 'left: ' + left + 'px;';
        var spotModal = '\
        <div id="enterSpotModal" style="position: absolute; display: none; color: white; ' + leftStyle + '"> \
            <input placeholder="Enter Spot # (then Enter)" id="spotNumber" type="text"> \
        </div>';

        $('body').append(spotModal);
    }
}