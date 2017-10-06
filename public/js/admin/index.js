$(document).ready((event) => {
    listZones();
})

function listZones(){
    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        succes: (res) => {
            var txt = '';
            for (var i in res) {
                txt += '<h5 class="ui dividing header" id="zoneName">Test</h5>'
            }
            document.getElementById("zoneName").innerHTML = txt
        }
    })
}