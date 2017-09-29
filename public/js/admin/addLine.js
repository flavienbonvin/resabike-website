$(document).ready(function () {
    $('select.dropdown').dropdown();
    $(document).on('keydown', '.search.dropdown input', function () {
        var id = this.parentNode.children[0].id;
        autoComplete(this,id);
    })
})
function autoComplete(t,id) {
    if(t.value.length<3){
        document.getElementById(id).innerHTML = '';
        $('select.dropdown').dropdown();
        return;
    }
    $.ajax({
        url: '/services/autoCompletionAPI?part='+t.value,
        type: 'GET',
        success: function (res) {
            console.log(res);
            var txt = '';
            for(var i = 0;i<res.length;i++){
                txt+='<option value="'+res[i]+'">'+res[i]+'</option>';
            }
            document.getElementById(id).innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
}
function createBySelection(depart,arrivee){
    $("#departFinal").val(depart)
    $("#arriveeFinal").val(arrivee)
    $("#suggestForm").submit();

}