module.exports = {
    /*
        ADMIN
    */

    //AddLine
    addLine: 'Ajout de ligne',
    labelStart: 'Départ',
    optionStart: 'Lieu de départ',
    labelEnd: 'Arrivée',
    optionEnd: 'Lieu d\'arrivée',
    buttonCreate: 'Créer',
    labelZone: 'Zone',
    buttonValidate: 'Valider',

    //AddUser
    titleAddUser: 'Ajout d\'un utilisateur',
    labelRole: 'Role du nouvel utilisateur',
    optionRole: 'Role',
    optionBusDriver: 'Chauffeur de bus',
    optionZoneAdmin: 'Administrateur de zone',
    optionSysAdmin: 'Administrateur system',
    labelUsername: 'Nom d\'utilisateur',
    labelPassword: 'Mot de passe',
    labelPasswordConfirm: 'Confirmer le mot de passe',
    labelEmail: 'Email',
    labelSelectZone: 'Selectionnez la zone ',
    labelResetPassword: 'Changer de mot de passe lors de la première connexion',

    //Index
    titleZoneList: 'Liste des zones',
    buttonDelete: 'Supprimer',
    labelLine: 'Ligne',

    //Login
    titleLogin: 'Connexion',
    labelConnect: 'Connecter',
    buttonEdit: 'Editer',

    //UserManagement
    titleUserManagement: 'Gestion des utilisateurs',
    //TODO: CHange text in javascipt

    //Remorques
    titleTrailerManagement: 'Gestion des remorques',
    labelNoTrailer: 'Pas de remorques en attente',
    labelDate: 'Date',
    labelAllocateTrailer: 'Allouer une remorque',
    labelDontAllocateTrailer: 'Ne pas allouer de remorque',
    //TODO: finish once the page is finished

    //Zone
    titleAddNewZone: 'Ajout d\'une zone',
    labelZoneName: 'Nom de la zone',
    titleEditZone: 'Modification des zones',
    //TODO: change text in javascript

    //Menu title
    home: 'Acceuil',
    addLineMenu: 'Ajouter ligne',
    addUserMenu: 'Ajouter user',
    manageZoneMenu: 'Gérer zones',
    manageUserMenu: 'Gérer utilisateurs',
    manageTrailerMenu: 'Gérer remorques',
    manageBooking: 'Voir les réservation',
    buttonLogout: 'Deconnexion',
    dropDownLanguage: 'Langue',
    langFrench: 'Français',
    langEnglish: 'English',
    langGerman: 'Deutsch',

    /*
        CLIENT
    */
    //Index
    titleWelcome: 'Bienvenue sur resabike',
    resabikeDesc: 'Resabike est un système rapide et facile d\'utilisation vous permettant de réserver une place pour vos vélos',
    titleReservation: 'Reservation',
    labelDateOfReservation: 'Date de la réservation',
    labelNameForname: 'Votre nom - prénom', 
    labelNumberOfBikes: 'Nombre de vélo',
    labelZoneChoice: 'Choisissez votre zone',
    labelDepartureChoice: 'Choisissez votre départ',
    labelDestinationChoice: 'Choisissez votre destination',
    labelFrom: 'De',
    labelTo: 'à',
    labelFor: 'Pour',
    labelForBikeNumber: 'vélo(s) reservé par',
    buttonNewBooking: 'Nouvelle reservation',
    buttonBook: 'Réserver',
    minutes: 'minutes',
    administratorNeeded: 'Confirmation de l\'administrateur necessaire',
    duration: 'durée',
    supportedLine: 'Ligne supportée par le système',
    unsupportedLine: 'Ligne non supportée par le système',
    helpButton: 'Aide',
    remainingSeats : 'places restates ',

    //CancelBooking
    titleConfirmBookCancel: 'Confirmation de suppression',
    tableTitleSchedule: 'Horaire',
    tableTitleName: 'Nom',
    tableTitleStartStation: 'Station de départ',
    tableTitleEndStation: 'Station d\'arrivée',
    tableStatus: 'Status',
    buttonConfirmDelete: 'Confirmer la supprssion',

    //Help modal
    modalTitle: 'Aide pour la réservation',
    helpDescription1: 'Afin d\'effectuer une réservation vous devez indiquer:',
    helpDescriptionList1: 'la date à laquelle vous voulez voyager',
    helpDescriptionList2: 'votre nom, servant au chauffeur pour vérifier la présence des différents groupes',
    helpDescriptionList3: 'votre email, vous permettant de supprimer la réservation',
    helpDescriptionList4: 'le nombre de vélo',
    helpDescriptionList5: 'l\'arrêt auquel vous prendrez le bus',
    helpDescriptionList6: 'l\'arrêt auquel vous sortirez du bus',
    helpDescription2: 'Une fois ces informations indiquées une liste des connextions possibles vous sera présentée',
    buttonClose: 'Fermer l\'aide',

    //About
    titleAbout: 'A propos',
    about1: 'Ce projet a été réalisé par deux étudiants en informatique de gestion à la HES de Sierre: ',
    aboutCreator1: 'Flavien Bonvin',
    aboutCreator2: 'Maxime Bétrisey',

    /*
        DRIVER
    */
    //Index
    titleSelectLine: 'Selection de la ligne',
    tableTitleStartHour: 'Heure de départ',
    tableTitleTrailer: 'Remorque',
    tableTitleAction: 'Action',
    labelYes: 'Oui',
    labelNo: 'Non',
    buttonDetails: 'Détails',


    //Details
    buttonReturn: 'Retour',
    titleTripsWithBikes: 'Voyages ayant des vélos',
    tableTitleEnterStation: 'Station d\'entrée',
    tableTitleExitStation: 'Station de sortie',

    //Email
    titreEmailReservation : 'Votre reservation du ',
    emailReservation : `<p>Bonjour,</p><p>Votre r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e.</p><p>Pour annuler votre reservation `,
    emailReservationAttente : `<p>Bonjour,</p><p>Votre r&eacute;servation est en attente. Vous allez recevoir un email de confirmation d'ici peu.</p><p>Pour annuler votre reservation `,
    emailCickHere : `cliquez ici`
}