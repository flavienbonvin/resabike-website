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

function deleteLine(id){
    $.ajax({
        url: '/admin/line/delete',
        type: 'POST',
        data: 'idToDel='+id,
        success: function(res) {
            refreshZoneWithDetails();
        }
    })
}

function refreshZoneWithDetails(){
    $.ajax({
        url: '/services/retrieveZoneAndLine',
        type: 'GET',
        success: function(res) {
            var txt = '';
            for (var i in res) {
                txt += '<div id="listZone">' + 
                    '<h4 class="ui dividing header">  ' + res[i].name + ' </h4>' +
                    '<div class="ui middle aligned divided list">' +
                        '<div class="item">' +
                            '<div class="right floated content">' +
                                '<div class="ui button">Edit</div>' +
                                '<div class="ui button" onclick="deleteZone(' + res[i].id + ')">Delete</div>' +
                            '</div>' +
                            '<div class="content">ligne ' + res[i].id + ' ( ' + res[i].startStation.name + ' - ' + res[i].endStation.name + ')</div>' +
                        '</div>' +
                    '</div>' + 
                '</div>'
            }
            document.getElementById("listZone").innerHTML = txt;
        }
    })
}