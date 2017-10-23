$(document).ready(function(){
    if($("#errorBox").length>0){
        $('#errorBox').modal('show')
    }
    else if($("#msgBox").length>0){
        $('#msgBox').modal('show')
    }
})

$('#langSwitch').click(function(v){
    console.log(v.target.value);
})

function changeLanguage(lang){
    var loc = window.location.href;
    var locSplit = loc.split('/');
    locSplit[3] = lang.value;
    loc = locSplit.join('/');
    window.location = loc;
    console.log(locSplit[3]);
}