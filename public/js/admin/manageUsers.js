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
                                '<a class="ui button" href="/admin/users/edit/'+res[i].id+'">Edit</a>' +
                                '<div class="ui button" onclick="resetPassword('+res[i].id+')">Reset password</div>' +
                                '<div class="ui button" onclick="deleteUser('+res[i].id+')">Delete</div>' +
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
        url: '/admin/users/delete',
        type: 'POST',
        data: 'idToDel=' + id,
        success: (res)  => {
            loadUsers();
        }
    })
}

function resetPassword(id){
    $.ajax({
        url: '/admin/users/reset',
        type: 'POST',
        data: 'idToEdit=' + id,
        success: (res) => {
        }
    })
}
