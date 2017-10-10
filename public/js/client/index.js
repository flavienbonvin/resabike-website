$(document).ready(function () {
    loadZone();
    $('select.dropdown').dropdown();
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
                return day + '-' + month + '-' + year+', ' + hour + ':' + min;
            }
        }
    });
})

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