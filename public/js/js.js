var translate = [];


$(document).ready(function () {
    if ($("#errorBox").length > 0) {
        $('#errorBox').modal('show')
    }
    else if ($("#msgBox").length > 0) {
        $('#msgBox').modal('show')
    }
    $('#languageDropdown').val(langUsed);
    loadTranslate();
})

$('#langSwitch').click(function (v) {
    
})

function changeLanguage(lang) {
    var loc = window.location.href;
    var locSplit = loc.split('/');
    locSplit[3] = lang.value;
    loc = locSplit.join('/');
    window.location = loc;
}

function loadTranslate(){
    translate = JSON.parse(translate.replace(/&quot;/g,'"'));
}


