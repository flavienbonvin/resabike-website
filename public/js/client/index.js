$(document).ready(function () {
    loadZone();
    $('select.dropdown').dropdown();
})

function loadZone() {
    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        success: (res) => {
            var txt = '<option value="">Choissiez votre zone</option>';
            for (var i = 0; i < res.length; i++) {
                txt += '<option value="' + res[i].id + '">' + res[i].name + '</option>';
            }
            document.getElementById('zone').innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
}