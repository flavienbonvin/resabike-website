$(document).ready(function(event){
    loadZone();
})

function loadZone(){
    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        success: (res) => {
            var txt = '';
            for (var i in res) {
                txt += '<div class="item">'+
                            '<div class="right floated content">'+
                                '<div class="ui button" onclick="updateZone('+res[i].id+',this)">Update</div>'+
                                '<div class="ui button" onclick="deleteZone('+res[i].id+')">Delete</div>'+
                            '</div>'+
                            '<div class="content">'+
                                '<div class="ui form">'+
                                    '<div class="two fields">'+
                                        '<div class="field">'+
                                            '<input id="updateName'+res[i].id+'" type="text">'+
                                        '</div>'+
                                        '<div class="field">'+
                                            '<div class="ui button" onclick="saveUpdate()">Save</div>'+
                                            '<div class="ui button" onclick="cancelUpdate()">Cancel</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="content">'+
                                '<span>'+res[i].name+'</span>'+
                            '</div>'+
                        '</div>'


            }
            document.getElementById("pastModif").innerHTML = txt;
        }
    })
}
function deleteZone(id){
    $.ajax({
        url: '/admin/zone/delete',
        type: 'POST',
        data: 'idToDel='+id,
        success: (res) => {
            loadZone();
        }
    })
}
var savedName = "";
var savedId = -1; 
var savedRoot = null;
function updateZone(id,t){
    var root = t.parentNode.parentNode;
    savedRoot = root;
    savedName = root.children[2].children[0].innerHTML;
    savedId = id;

    document.getElementById('updateName'+id).value = savedName;

    root.children[0].style.display='none';
    root.children[2].style.display='none';
    root.children[1].style.display='block';
}

function cancelUpdate(){
    document.getElementById('updateName'+savedId).value = savedName;
    savedRoot.children[0].style.display='block';
    savedRoot.children[2].style.display='block';
    savedRoot.children[1].style.display='none';
}
function saveUpdate(){
    $.ajax({
        url: '/admin/zone/update',
        type: 'POST',
        data: 'idToUpdate='+savedId+"&newName="+document.getElementById('updateName'+savedId).value,
        success: (res) => {
            loadZone();
        }
    })
}