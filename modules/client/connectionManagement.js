var axios = require('axios');
var database = require('../database');
var Connection = require("../../objects/Connection");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const nbMaxVelo = 6;

var self = module.exports = {

    getConnectionForTrip(body) {
        return new Promise((resolve, reject) => {

            if (!self.compareDate(body.date)) {
                reject('vous reservez trop tard');
                return;
            }

            self.requestAPI(body).then((response) => {
                var stationDepart = response[1];
                var stationArrivee = response[2];
                response = response[0];
                var connectionsTrip = [];
                for (var i in response.data.connections) {
                    var lineInfoTemp = [];
                    connectionsTrip.push(self.resolveHoraire(response.data.connections[i], body));
                }
                Promise.all(connectionsTrip).then((res) => {
                    var horairesDispo = [];
                    for (var i = 0; i < res.length; i++) {
                        var conn = new Connection(stationDepart.name, body.depart, stationArrivee.name, body.destination, response.data.connections[i].departure, response.data.connections[i].duration, res[i]);
                        horairesDispo.push(conn)
                    }
                    resolve([body, horairesDispo]);
                })
            })


        })
    },

    compareDate(date) {
        date = date.split(',');
        var dateTemp = date[0].split('-');
        var lastDateToBook = new Date(Number(dateTemp[2]), Number(dateTemp[1]) - 1, Number(dateTemp[0]) - 1, 17, 0, 0, 0);
        var dateNow = new Date();
        if (dateNow > lastDateToBook) {
            return false;
        }
        return true;

    },

    requestAPI(body) {
        return new Promise((resolve, reject) => {
            database.Station.findById(body.depart).then((stationDepart) => {
                database.Station.findById(body.destination).then((stationArrivee) => {
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
                        resolve([response, stationDepart, stationArrivee])
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
    resolveHoraire(connection, body) {
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
                    sortie: currentLeg.exit.name,
                    nbPlaceRestant: nbMaxVelo
                }

                linesInfoTemp.push(self.isLineinDB(lineInfoTemp));
            }
            Promise.all(linesInfoTemp).then((linesInfo) => {
                var lineGlobal = [];
                for (var i = 0; i < linesInfo.length; i++) {
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
            console.log(legTemp.idLine+" "+legTemp.depart+" "+legTemp.sortie)
            if (legTemp.idLine == -1) {
                resolve(legTemp);
                return;
            }
            database.Line.find({
                where: {
                    id: {
                        [Op.like]: "%"+legTemp.idLine
                    }
                }
            }).then((line) => {
                console.log(line);
                if (line == null) {
                    legTemp.idLine = -1;
                    resolve(legTemp);
                } else {
                    legTemp.idLine = line.id;
                    self.checkNBVeloOnLine(legTemp).then((legTemp) => {
                        resolve(legTemp)
                    })
                }

            })
        })
    },

    checkNBVeloOnLine(legTemp) {
        return new Promise((resolve, reject) => {
            
            self.findRealStartHour(legTemp).then((lineDepart)=>{
                database.Trips.sum('number', {
                    where: {
                        idLine: legTemp.idLine,
                        lineStartHour: lineDepart
                    },
                    include: [{ model: database.Book }]
                }).then(sum => {
                    sum = sum || 0;
                    legTemp.nbPlaceRestant -= sum;
                    resolve(legTemp)
                })
            })
            
        })
    },
    findRealStartHour(legTemp){
        return new Promise((resolve,reject) => {
            database.Line.find({
                where:{
                    id : legTemp.idLine
                },
                include: [
                    {
                        model: database.Station,
                        as: 'startStation'
                    },
                    {
                        model: database.Station,
                        as: 'endStation'
                    }
                ]
            }).then((line) => {
                var dateTemp = legTemp.departTime.split(" ");
                console.log(dateTemp);
                dateTemp[0] = dateTemp[0].split('-');
                dateTemp[0] = dateTemp[0][2]+'-'+dateTemp[0][1]+'-'+dateTemp[0][0];
                dateTemp[1] = dateTemp[1].split(':');
                dateTemp[1] = dateTemp[1][0]+':'+dateTemp[1][1]
                console.log(dateTemp);
                var urlApi = "https://timetable.search.ch/api/route.en.json?from=" + line.startStation.name + "&to=" + line.endStation.name + "&date=" + dateTemp[0] + "&time=" + dateTemp[1];
                console.log("Api to get realHour :"+urlApi)
                axios.get(urlApi).then((response) => {
                    var connections = response.data.connections;
                    console.log(JSON.parse(JSON.stringify(connections)));
                    for(var j = 0;j<connections.length;j++){
                        var realDep = new Date(connections[j].departure);
                        var realFin = new Date(connections[j].arrival);
                        var currentTime = new Date(legTemp.departTime);
                        console.log(realDep+" "+currentTime+" "+realFin);
                        console.log("debug "+connections[j].legs[0].line +"=="+ line.id.split('-')[1])
                        if(connections[j].legs[0].line && connections[j].legs[0].line == line.id.split('-')[1]){
                            if(currentTime>=realDep && currentTime<=realFin){
                                resolve(realDep);
                                return;
                            }
                        }
                    }
                })
            })
        })
    }
}