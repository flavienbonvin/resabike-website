$(document).ready(function(event) {
    loadUsers();
})

function loadUsers(){
    $.ajax({
        url: '/services/retrieveAllUsers',
        type: 'GET',
        success: function(res) {
            var txt = '';
            for (var i in res){
                txt += '<div class="item">' + 
                            '<div class="right floated content">' +
                                '<a class="ui button" href="/'+langUsed+'/admin/users/edit/'+res[i].id+'">'+ translate['buttonEdit'] +'</a>' +
                                '<div class="ui button" onclick="deleteUser('+res[i].id+')"> ' + translate['buttonDelete'] +'</div>' +
                            '</div>' +
                            '<div class="content">' +
                                res[i].pseudo +
                            '</div>' +
                        '</div>'
            }

            document.getElementById("modifUsers").innerHTML = txt;
        }
    })
}

function deleteUser(id){
    $.ajax({
        url: '/'+langUsed+'/admin/users/delete',
        type: 'POST',
        data: 'idToDel=' + id,
        success: (res)  => {
            loadUsers();
        }
    })
}
