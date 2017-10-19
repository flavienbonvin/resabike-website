var database = require('../database');
var Book = require('../../objects/Book');
var Trip = require('../../objects/Trip');
var sha256 = require('sha256');
var email = require('../email');

const nbMaxVelo = 6;


var self = module.exports = {

    addBook(body) {
        return new Promise((resolve, reject) => {
            var token = sha256('token'+body.bookPseudo+new Date());
            //on crée une reservation avec le status en attente
            var book = new Book(null, body.bookIdStartStation, body.bookIdEndStation, body.bookPseudo, body.bookEmail, body.bookNumber, token, false);
            database.Book.create(book.convertToSequelize()).then((book) => {
                // on recupère la reservation et on demande toutes les lignes dans la reservation
                self.getAllStationId(body).then((stationsId) => {
                    var trips = [];
                    var status = true;
                    var dateAffichage = stationsId[0].departTime;
                    dateAffichage = dateAffichage.split('-');
                    dateAffichage = dateAffichage[2]+'.'+dateAffichage[1]+'.'+dateAffichage[0];

                    // on crée tous les objets trip pour les ajouter a la db
                    for (var i = 0; i < stationsId.length; i++) {
                        if(stationsId[i].nbPlaceRestant-body.bookNumber<0){
                            status = false;
                        }
                        var trip = new Trip(null, stationsId[i].departTime, stationsId[i].numeroLine, book.id, stationsId[i].idDepart, stationsId[i].idFin).convertToSequelize();
                        trips.push(trip);
                    }

                    database.Trips.bulkCreate(trips).then(() => {
                        if(status){
                            database.Book.update({
                                status : true
                            }, {
                                where : {
                                    id : book.id
                                }
                            }).then(() => {
                                //self.sendEmailOK(dateAffichage,body,token).then(() => {
                                    resolve();
                                //})
                            })
                        }else{
                            //self.sendEmailWait(dateAffichage,body,token).then(() => {
                                resolve();
                            //})
                        }
                    })
                })
            })
        })
    },

    sendEmailOK(dateAffichage,body,token){
        return new Promise((resolve, reject) =>{
            email.createEmail(body.bookEmail,'Votre reservation du '+dateAffichage,`<p>Bonjour,</p>
            <p>Votre r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e.</p>
            <p>Pour annuler votre reservation <a href="http://127.0.0.1:10008/book/cancel/${token}">cliquez ici</a></p>`).then(() =>{
                resolve();
            })
        })  
    },
    sendEmailWait(dateAffichage,body,token){
        return new Promise((resolve, reject) =>{
            email.createEmail(body.bookEmail,'Votre reservation du '+dateAffichage,`<p>Bonjour,</p>
            <p>Votre r&eacute;servation est en attente. Vous allez recevoir un email de confirmation d'ici peu.</p>
            <p>Pour annuler votre reservation <a href="http://127.0.0.1:10008/book/cancel/${token}">cliquez ici</a></p>`).then(() =>{
                resolve();
            })
        })  
    },

    getAllStationId(body) {
        return new Promise((resolve, reject) => {
            var stationsPromise = [];
            for (var i = 0; i < Number(body.nbLine); i++) {
                stationsPromise.push(database.Station.find({
                    where: {
                        name: body['depart' + i]
                    }
                }))
                stationsPromise.push(database.Station.find({
                    where: {
                        name: body['sortie' + i]
                    }
                }))
            }
            Promise.all(stationsPromise).then((res) => {
                var list = [];
                for (var i = 0; i < res.length; i += 2) {
                    var j = i / 2;
                    var temp = {
                        idDepart: res[i].id,
                        departTime : body['departTime' + j],
                        idFin : res[i + 1].id,
                        numeroLine : Number(body['idLine' + j]),
                        nbPlaceRestant : Number(body['nbPlaceRestant'+j])
                    }
                    list.push(temp);

                }
                resolve(list);
            })
        })
    }
}