var axios = require('axios')
var Station = require('../objects/Station')


module.exports = {
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
                        var station = new Station(-1, stop.name, stop.x, stop.y);
                        stops.push(station);

                        for (var k in response.data.connections[0].legs[0].stops) {
                            stop = response.data.connections[0].legs[0].stops[k];
                            station = new Station(-1, stop.name, stop.x, stop.y);

                            stops.push(station);
                        }

                        stop = response.data.connections[0].legs[0].exit;
                        station = new Station(-1, stop.name, stop.x, stop.y);
                        stops.push(station);
                    } else {
                        reject("This isn't a bus line");
                    }
                } else {
                    reject("Tehre is more than one line");
                }
                resolve(stops);
            })
        })
    }
}