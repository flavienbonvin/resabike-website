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
            console.log("API QUERRY: https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to)
            axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {
                //Check if there is more thant one leg, a leg is a change of bus (and change of line), if there is a change, the line is wrong
                r = response;
                // load all stations because 
                if (response.data.connections[0].legs.length <= 2) {
                    var idLine = response.data.connections[0].legs[0].line;
                    to = response.data.connections[0].legs[0].terminal;
                    self.findDeparture(idLine, to).then((results) => {
                        resolve(results);
                    }).catch((error) => {
                        reject(error);
                    })
                }
                // 
                else {
                    var error = '';
                    var errorArray = [];

                    var linePromises = [];
                    var lineToCheck = [];
                    for (var j = 0; j < response.data.connections.length; j++) {
                        for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {
                            var curLeg = response.data.connections[0].legs[i]
                            var type = curLeg.type;
                            if (type == 'bus' || type == 'post') {
                                if(curLeg.line && lineToCheck.indexOf(curLeg.line)==-1){
                                    var idLine = curLeg.line;
                                    var toTemp = curLeg.terminal;
                                    lineToCheck.push(curLeg.line);
                                    linePromises.push(self.findDeparture(idLine, toTemp));
                                }
                                
                            }
                        }
                    }


                    Promise.all(linePromises).then((response) => {
                        for (var i = 0; i < response.length; i++) {
                            error += response[i][0][0].name + ' | '
                                + response[i][0][1].name + '('+response[i][1]+')\n';
                            errorArray.push([response[i][0][0].name, response[i][0][response[i][0].length - 1].name,response[i][1]]);
                        }
                        console.log(errorArray)
                        reject([error, errorArray]);
                    })

                }
            }).catch((error) => {
                console.log(error);
                var readableObj = renderAddon.readableObject(r.data)
                reject("The API returns " + readableObj);
            })
        })
    },


    findDeparture(idLine, to) {
        return new Promise((resolve, reject) => {
            axios.get("https://timetable.search.ch/api/stationboard.en.json?stop=" + to).then((response) => {
                var info = response.data.connections;
                var nameToFind = 0;
                for (var i = 0; i < info.length; i++) {
                    if (info[i].line == idLine) {
                        nameToFind = info[i].terminal.name;
                        i = info.length;
                    }
                }
                self.correctStation(nameToFind, to).then((response) => {
                    resolve(response);
                })
            })
        })
    },

    correctStation(from, to) {
        return new Promise((resolve, reject) => {
            var stops = new Array();
            var idLine;
            console.log("API QUERRY2: https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to)
            axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {

                var type = response.data.connections[0].legs[0].type;
                idLine = response.data.connections[0].legs[0].line;

                //Check if the transport type is a bus or a postal bus, if not this isn't a bus line
                if (type == 'bus' || type == 'post') {

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
                    var results = [];
                    results[0] = stops;
                    results[1] = idLine;

                    resolve(results);

                } else {
                    reject("This isn't a bus line");
                }
            })
        })
    },

    prepareStation(body) {
        return new Promise((resolve, reject) => {
            self.getStopsForLine(body.departFinal, body.arriveeFinal).then((stops) => {
                self.insertStationInDB(stops, body.zoneFinal).then((msg) => {
                    resolve(msg)
                }).catch((error) => {
                    reject(error);
                })
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /**
     * Inserts an array of Station in the database (station table)
     * 
     * @param {[Station[], number]} stops 
     * @param {Number} idZone
     */
    insertStationInDB(stopsAndLine, idZone) {
        var stops = stopsAndLine[0];
        return new Promise((resolve, reject) => {
            var listProm = [];
            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i].convertToSequelize();

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
                        var stop = stops[i].convertToSequelize();
                        toAdd.push(stop);
                        console.log('Inserting in DB ' + stop.name);
                    }
                    else
                        console.error('Alredy in DB ' + stopTemp.name);
                }
                database.Station.bulkCreate(toAdd).then(() => {
                    //Once the station is created we have to add the line in the DB
                    self.insertLineInDB(stopsAndLine, idZone).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    })
                })

            }).catch(() => {
            })
        })
    },

    /**
     * Inserts a line in the database (line table)
     * 
     * @param {[Station[], number]} stops
     * @param {Number} idZone
     */
    insertLineInDB(stopsAndLine, idZone) {
        var stops = stopsAndLine[0];
        return new Promise((resolve, reject) => {
            var listProm = [];
            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i].convertToSequelize();

                listProm.push(database.Station.find({
                    where: {
                        name: stop.name
                    }
                }))
            }
            Promise.all(listProm).then((stopsTemp) => {
                var line = new Line(idZone + '-' + stopsAndLine[1], stopsTemp[0].id, stopsTemp[stopsTemp.length - 1].id, idZone);
                database.Line.find({
                    where: {
                        id: line.id,
                        idStartStation: line.idStartStation,
                        idEndStation: line.idEndStation
                    }
                }).then((lineTemp) => {
                    if (lineTemp == null) {
                        database.Line.create(line.convertToSequelize()).then((line) => {
                            console.log('Inserting linestation in DB')
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
    },

    /**
 * Delete a zone
 * @param {string} body 
 */
    deleteLine(body) {
        return new Promise((resolve, reject) => {
            var idLine = body.idToDel;
            database.Trailer.destroy({
                where: {
                    idLine: body.idToDel
                }
            })
            database.Line.destroy({
                where: {
                    id: body.idToDel
                }
            }).then((zoneTemp) => {
                resolve();
            }).catch((error) => {
                reject(error);
            })
        })
    },
}