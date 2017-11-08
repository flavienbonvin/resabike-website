$(document).ready(() => {
    $('select.dropdown').dropdown();
    getAllLines();

})

function getAllLines() {
    $.ajax({
        url: '/services/retrieveAllLineByZone',
        type: 'POST',
        data: 'zoneId=' + 1,
        success: function(res) {
            var txt = '<option value="">Zone</option>';
            
            for (var i in res){
                txt += '<option value="' + res[i].id + '">' + res[i].id + ' ' + res[i].startStation.name + ' - ' + res[i].endStation.name + '</option>';
            }
            
            document.getElementById('lineDropdown').innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
}