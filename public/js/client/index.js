$(document).ready(function () {
    initCal();
    $('select.dropdown').dropdown();

})

function initCal() {
    if (document.getElementById('calendar')) {
        loadZone();
        $('#calendar').calendar({
            ampm: false,
            formatter: {
                datetime: function (date, settings) {
                    if (!date) return '';
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    var min = date.getMinutes();
                    var hour = date.getHours();
                    return day + '-' + month + '-' + year + ', ' + hour + ':' + min;
                }
            }
        });
    }
}
function loadZone() {
    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        success: (res) => {
            var txt = '<option value="">Choisissez votre zone</option>';
            for (var i = 0; i < res.length; i++) {
                txt += '<option value="' + res[i].id + '">' + res[i].name + '</option>';
            }
            document.getElementById('zone').innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
}

function loadStation() {
    $.ajax({
        url: '/services/getStationByZone',
        type: 'POST',
        data: 'zoneId=' + document.getElementById('zone').value,
        success: (res) => {
            var txt = '<option value="">Choisissez votre zone</option>';
            for (var i = 0; i < res.length; i++) {
                txt += '<option value="' + res[i].id + '">' + res[i].name + '</option>';
            }
            document.getElementById('depart').innerHTML = txt;
            document.getElementById('destination').innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
}
function reservation(t) {
    var info = t.parentNode.parentNode.children[1];
    var departs = $(info).find('.depart');
    var departsTime = $(info).find('.departTime');
    var sorties = $(info).find(".sortie");
    var idLines = $(info).find(".idLine");
    var nbPlaceRestants = $(info).find(".nbPlaceRestant");
    var size = $(info).find('.depart').length;
    
    for (var i = 0; i < departs.length; i++) {
        var txt = '<input type="text" name="depart'+i+'" value="'+departs[i].innerHTML+'" />'+ 
                    '<input type="text" name="departTime'+i+'" value="'+departsTime[i].innerHTML+'" />' +
                    '<input type="text" name="sortie'+i+'" value="'+sorties[i].innerHTML+'" />'+
                    '<input type="text" name="idLine'+i+'" value="'+idLines[i].innerHTML+'" />'+ 
                    '<input type="text" name="nbPlaceRestant'+i+'" value="'+nbPlaceRestants[i].innerHTML+'" />'
        document.getElementById('hiddenForm').innerHTML += txt;
    }
    $("#nbLine").val(size);
    $("#hiddenForm").submit();
}