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
        url: '/'+langUsed+'/admin/line/delete',
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
            console.log(res);
            for (var i in res) {
                var zone = res[i];
                txt += '<div id="listZone">' + 
                    '<h4 class="ui dividing header">  ' + zone.name + ' </h4>' +
                    '<div class="ui middle aligned divided list">';
                for(var j in zone.lines){
                    var line = zone.lines[j];
                    txt+='<div class="item">' +
                            '<div class="right floated content">' +
                                '<div class="ui button" onclick="deleteLine(' + line.id + ')">Delete</div>' +
                            '</div>' +
                            '<div class="content">ligne ' + line.id + ' ( ' + line.startStation.name + ' - ' + line.endStation.name + ')</div>' +
                        '</div>'
                }
                txt+='</div>' + 
                '</div>'
            }
            document.getElementById("listZone").innerHTML = txt;
        }
    })
}