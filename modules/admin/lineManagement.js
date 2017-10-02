var axios = require('axios');
var Station = require('../../objects/Station');
var Line = require('../../objects/Line');
var LineStation = require('../../objects/LineStation');
var database = require('../database');
var renderAddon = require('../../modules/renderAddon');


var self = module.exports = {

    /**
     * Method allowing to retrive stops from a given start and destination
     * 
     * @param {string} from 
     * @param {string} to 
     */
    getStopsForLine(from, to) {
        return new Promise((resolve, reject) => {
            var r = null;
            axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {
                //Check if there is more thant one leg, a leg is a change of bus (and change of line), if there is a change, the line is wrong
                r = response;
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
            }).catch((error) => {
                var readableObj = renderAddon.readableObject(r.data)
                reject("The API returns " + readableObj);
            })
        })
    },
    prepareStation(body) {
        return new Promise((resolve, reject) => {
            self.getStopsForLine(body.departFinal, body.arriveeFinal).then((stops) => {
                self.insertStationInDB(stops).then((msg)=>{
                    resolve(msg)
                }).catch((error) =>{
                    reject(error);
                })
            }).catch((error) =>{
                reject(error);
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