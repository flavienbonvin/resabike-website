$(document).ready(function () {
    if ($("#errorBox").length > 0) {
        $('#errorBox').modal('show')
    }
    else if ($("#msgBox").length > 0) {
        $('#msgBox').modal('show')
    }
    $('#languageDropdown').val(langUsed);
})

$('#langSwitch').click(function (v) {
    console.log(v.target.value);
})

function changeLanguage(lang) {
    var loc = window.location.href;
    var locSplit = loc.split('/');
    locSplit[3] = lang.value;
    loc = locSplit.join('/');
    window.location = loc;
}

function getTxt(value) {
    var lang = window.location.href.split('/');
    lang = lang[3];
    console.log(lang);
    $.ajax({
        url: '/services/traduction?label=' + value+'&lang='+lang,
        type: 'GET',
        success: function (res) {
            return res
        }
    })
}