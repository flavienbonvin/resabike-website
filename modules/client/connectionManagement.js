var axios = require('axios');
var database = require('../database')
var Connection = require("../../objects/Connection");

var self = module.exports = {

    getConnectionForTrip(body) {
        return new Promise((resolve, reject) => {

            self.requestAPI(body).then((response) => {
                var stationDepart = response[1];
                var stationArrivee = response[2];
                response = response[0];
                var connectionsTrip = [];
                for (var i in response.data.connections) {
                    var lineInfoTemp = [];
                    connectionsTrip.push(self.resolveHoraire(response.data.connections[i],body));
                }
                Promise.all(connectionsTrip).then((res) => {
                    var horairesDispo = [];
                    for(var i = 0;i<res.length;i++){
                        var conn = new Connection(stationDepart.name, body.depart, stationArrivee.name, body.destination, response.data.connections[i].departure, response.data.connections[i].duration, res[i]);
                        horairesDispo.push(conn)
                    }
                    resolve([body, horairesDispo]);
                })
            })


        })
    },

    requestAPI(body) {
        return new Promise((resolve, reject) => {
            database.Station.findById(body.depart).then((stationDepart) => {
                database.Station.findById(body.destination).then((stationArrivee) => {
                    console.log(body.date);
                    var temp = body.date;
                    var date = temp.split(',');
                    var dateTemp = date[0].split('-');
                    dateTemp = dateTemp[1] + '/' + dateTemp[0] + '/' + dateTemp[2];
                    console.log("API QUERY: https://timetable.search.ch/api/route.en.json?from="
                        + stationDepart.name
                        + "&to=" + stationArrivee.name
                        + "&date=" + dateTemp
                        + "&time=" + date[1].replace(/\s/g, ''))
                    axios.get("https://timetable.search.ch/api/route.en.json?from=" + stationDepart.name + "&to=" + stationArrivee.name + "&date=" + date[0] + "&time=" + date[1]).then((response) => {
                        resolve([response,stationDepart,stationArrivee])
                    })
                })
            })
        })
    },

    /**
     * retourne un tableau de trips
     * @param {*} connection 
     * @returns {Promise<[]>}
     */
    resolveHoraire(connection,body) {
        return new Promise((resolve, reject) => {
            var linesInfoTemp = [];
            for (var j = 0; j < connection.legs.length - 1; j++) {
                var currentLeg = connection.legs[j];
                var idLine = -1;
                var type = "autre";
                if (currentLeg.type == 'bus' || currentLeg.type == 'post') {
                    idLine = currentLeg.line;
                    type = "bus";
                }
                var lineInfoTemp = {
                    idLine: currentLeg.line,
                    depart: currentLeg.name,
                    type: type,
                    departTime: currentLeg.departure,
                    finTime: currentLeg.exit.arrival,
                    sortie: currentLeg.exit.name
                }

                linesInfoTemp.push(self.isLineinDB(lineInfoTemp));
            }
            Promise.all(linesInfoTemp).then((linesInfo) => {
                var lineGlobal = [];
                for(var i = 0;i<linesInfo.length;i++){
                    lineGlobal.push(linesInfo[i]);
                }
                resolve(lineGlobal);
            })
        })
    },
    /**
     * Prend un parametre un trip et retourne un trip
     * @param {*} legTemp 
     */
    isLineinDB(legTemp) {
        return new Promise((resolve, reject) => {
            if (legTemp.idLine == -1) {
                resolve(false);
                return;
            }
            database.Line.find({
                where: {
                    id: legTemp.idLine
                }
            }).then((line) => {
                if (line == null) {
                    legTemp.idLine = -1;
                }
                resolve(legTemp);
            })
        })
    }
}