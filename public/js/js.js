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
    console.log(v.target.value);
})

function changeLanguage(lang) {
    var loc = window.location.href;
    var locSplit = loc.split('/');
    locSplit[3] = lang.value;
    loc = locSplit.join('/');
    window.location = loc;
}

function loadTranslate(){
    var lang = window.location.href.split('/');
    lang = lang[3];
    $.ajax({
        url: '/services/traduction?lang='+lang,
        type: 'GET',
        success: function (res) {
<<<<<<< HEAD
            return res
=======
            translate = res;
>>>>>>> 1bcdfe05a6dba7cddc2fa28376bf854a49d0b0a2
        }
    })
}


