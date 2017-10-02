$(document).ready(() => {
    $('select.dropdown').dropdown();
})

/*
    Reste à faire pour l'ajout de personne.

        - Controle que la personne n'existe pas déjà dans la base
        - Contrôle des champs (que l'email soit un email,...)
        - Contrôle que les mots de passses soient les mêmes (indication directe, pas à la confiormation)
        - Liste des zones crées 
        - Afficher le bouton pour créer l'utilisateur une fois que tout est bon dans le form
        
        - Voir si il faut aller chercher les rôles possibles dans la base de donnée ou pas 
        - Voir si le champs email est obligatoire (conmnexion avec le pseudo)
        - Voir si on peut extraire une partie des méthodes de création de user pour optimisation
*/