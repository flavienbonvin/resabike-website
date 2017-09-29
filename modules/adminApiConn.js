var axios = require('axios');
var Station = require('../objects/Station');
var database = require('../modules/database');


module.exports = {

    /**
     * 
     * @param {string} from 
     * @param {string} to 
     */
    getStopsForLine(from, to) {
        return new Promise((resolve, reject) => {
            axios.get("https://timetable.search.ch/api/route.en.json?from=" + from + "&to=" + to).then((response) => {
                //Old code kept if we want to make line haveing different lines in them
                //for (var i = 0; i < response.data.connections[0].legs.length; i++) {

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
                    for (var i = 0; i < response.data.connections[0].legs.length - 1; i++) {

                        var type = response.data.connections[0].legs[i].type;
                        if (type == 'bus' || type == 'post') {
                            error += response.data.connections[0].legs[i].name + ' | '
                                + response.data.connections[0].legs[i].terminal + '\n';
                        }
                    }
                    reject(error);
                }
                resolve(stops);
            })
        })
    },

    /**
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
                var toAdd = [];
                for(var i = 0;i<stopsTemp.length;i++){
                    var stopTemp = stopsTemp[i];
                    if (stopTemp == null){
                        toAdd.push(stops[i].convertToSequelize());
                        //database.Station.create(stop);
                        console.log('Inserting in DB' + stop.name)
                    }
                    else
                        console.log("Alredy in DB " + stopTemp.name)
                }
                database.Station.bulkCreate(toAdd).then(() =>{
                    database.close();
                    resolve();
                })
                
            }).catch(() => {
            })
        })
    }
}