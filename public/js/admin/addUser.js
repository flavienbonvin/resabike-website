$(document).ready(() => {
    $('select.dropdown').dropdown();
    getAllZone();
    
})
function getAllZone(){
    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        success: (res) => {
            var txt = '<option value="">Zone</option>';
            console.log(res)
            for (var i in res) {
                txt += '<option value="' + res[i].id + '">' + res[i].name + '</option>';
            }
            document.getElementById("zoneDropdown").innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
}

function controlForm(e){
    var validate = true;
    if(document.getElementById('role').value==""){
        document.getElementById('role').style.borderColor = 'red';
        validate = false;
    }
    if(document.getElementById('password').value.length < 6){
        document.getElementById('password').style.borderColor = 'red';
        validate = false;
    }
    if(document.getElementById('password').value != document.getElementById('passwordConfirmation').value){
        document.getElementById('passwordConfirmation').style.borderColor = 'red';
        validate = false;
    }

    if(!validate){
        e.preventDefault();
    }
}
function checkChangePass(t){
    if(document.getElementById('password').value == t.value){
        t.style.borderColor = 'green';
    }else{
        t.style.borderColor = 'rgba(34, 36, 38, 0.15)';
    }
}
/*
    Reste à faire pour l'ajout de personne.

        - Contrôle des champs (que l'email soit un email,...)
        - Contrôle que les mots de passses soient les mêmes (indication directe, pas à la confiormation)
        - Afficher le bouton pour créer l'utilisateur une fois que tout est bon dans le form
        
        - Voir si il faut aller chercher les rôles possibles dans la base de donnée ou pas
        - Voir si le champs email est obligatoire (conmnexion avec le pseudo)
*/

