var axios = require('axios');
var Station = require('../objects/Station');
var Line = require('../objects/Line');
var LineStation = require('../objects/LineStation');

var database = require('../modules/database');


var self = module.exports = {

    /**
     * Method allowing to retrive stops from a given start and destination
     * 
     * @param {string} from 
     * @param {string} to 
     */
    getStopsForLine(from, to) {
        return new Promise((resolve, reject) => {
            axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {

                //Check if there is more thant one leg, a leg is a change of bus (and change of line), if there is a change, the line is wrong
                if (response.data.connections[0].legs.length <= 2) {

                    var type = response.data.connections[0].legs[0].type;

                    //Check if the transport type is a bus or a postal bus, if not this isn't a bus line
                    if (type == 'bus' || type == 'post') {
                        var stops = new Array();

                        var stop = response.data.connections[0].legs[0];
                        var station = new Station(null, stop.name, stop.x, stop.y);
                        stops.push(station);

                        for (var k in response.data.connections[0].legs[0].stops) {
                            stop = response.data.connections[0].legs[0].stops[k];
                            station = new Station(null, stop.name, stop.x, stop.y);

                            stops.push(station);
                        }

                        stop = response.data.connections[0].legs[0].exit;
                        station = new Station(null, stop.name, stop.x, stop.y);
                        stops.push(station);
                    } else {
                        reject("This isn't a bus line");
                    }
                } else {
                    var error = '';
                    var errorArray = [];
                    for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {

                        var type = response.data.connections[0].legs[i].type;
                        if (type == 'bus' || type == 'post') {
                            error += response.data.connections[0].legs[i].name + ' | '
                                + response.data.connections[0].legs[i].terminal + '\n';
                            errorArray.push([response.data.connections[0].legs[i].name, response.data.connections[0].legs[i].terminal]);
                            //If the line isn't correctly entered, we suggest one based on what the API returns, this is the response[..].name and response[..].terminal fields
                        }
                    }
                    reject([error, errorArray]);
                }
                resolve(stops);
            })
        })
    },

    /**
     * Inserts an array of Station in the database (station table)
     * 
     * @param {Station[]} stops 
     */
    insertStationInDB(stops) {
        return new Promise((resolve, reject) => {

            var listProm = [];
            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i].convertToSequelize();
                console.log(stop)

                //Retrieve from our database all stations we wants to add (this returns null if we don't have this station)
                listProm.push(database.Station.find({
                    where: {
                        name: stop.name
                    }
                }))
            }
            Promise.all(listProm).then((stopsTemp) => {

                var toAdd = [];
                for (var i = 0; i < stopsTemp.length; i++) {
                    var stopTemp = stopsTemp[i];
                    if (stopTemp == null) {
                        toAdd.push(stops[i].convertToSequelize());

                        console.log('Inserting in DB' + stop.name)
                    }
                    else
                        console.log("Alredy in DB " + stopTemp.name)
                }
                database.Station.bulkCreate(toAdd).then(() => {
                    //Once the station is created we have to add the line in the DB
                    self.insertLineInDB(stops).then(() => {
                        database.close();
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    })
                })

            }).catch(() => {
            })
        })
    },

    //TODO: Est ce que c'est utile de récupérer la liste des promise sur le serveur? il suffirait pas de faire ce qui est dans le promise.all 
    //TODO: sauvegarder le numéro de ligne
    /**
     * Inserts a line in the database (line table)
     * 
     * @param {Station[]} stops 
     */
    insertLineInDB(stops) {
        return new Promise((resolve, reject) => {
            var listProm = [];
            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i].convertToSequelize();
                console.log(stop)

                listProm.push(database.Station.find({
                    where: {
                        name: stop.name
                    }
                }))
            }
            Promise.all(listProm).then((stopsTemp) => {
                var line = new Line(null, stopsTemp[0].id, stopsTemp[stopsTemp.length - 1].id, 1);
                //TODO: UTILE? line.idEndStation
                database.Line.find({
                    //TODO: ajouter le numéro de ligne au FIND
                    where: {
                        idStartStation: line.idStartStation,
                        idEndStation: line.idEndStation
                    }
                }).then((lineTemp) => {
                    if (lineTemp == null) {
                        database.Line.create(line.convertToSequelize()).then((line) => {
                            console.log(line);
                            var lineStationsToAdd = [];
                            //We have to save the order of the stops on the line, that's why we create this array of Station to add
                            for (var i = 0; i < stopsTemp.length; i++) {
                                var station = stopsTemp[i];
                                //TODO: est ce que LineStation à besoin d'un ID?
                                var linestation = new LineStation(null, line.id, station.id, i);
                                lineStationsToAdd.push(linestation.convertToSequelize());
                            }
                            database.LineStation.bulkCreate(lineStationsToAdd).then(() => {
                                resolve();
                            })
                        })
                    } else {
                        reject("line already in db");
                    }
                })

            })
        })
    }
}