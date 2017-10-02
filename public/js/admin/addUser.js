$(document).ready(() => {
    $('select.dropdown').dropdown();

    $.ajax({
        url: '/services/retrieveAllZones',
        type: 'GET',
        success: (res) => {
            var txt = '<option value="">Zone</option>';
            console.log(res)
            for (var i in res) {
                txt += '<option value="' + res[i] + '">' + res[i].name + '</option>';
            }
            document.getElementById("zoneDropdown").innerHTML = txt;
            $('select.dropdown').dropdown();
        }
    })
})
/*
    Reste à faire pour l'ajout de personne.

        - Contrôle des champs (que l'email soit un email,...)
        - Contrôle que les mots de passses soient les mêmes (indication directe, pas à la confiormation)
        - Afficher le bouton pour créer l'utilisateur une fois que tout est bon dans le form
        
        - Voir si il faut aller chercher les rôles possibles dans la base de donnée ou pas
        - Voir si le champs email est obligatoire (conmnexion avec le pseudo)
*/