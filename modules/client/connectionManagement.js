var axios = require('axios');
var database = require('../database')
var Connection = require("../../objects/Connection");

module.exports = {

    getConnectionForTrip(body) {
        return new Promise((resolve, reject) => {
            var depart;
            var arrivee;

            database.Station.findById(body.depart).then((stationDepart) => {
                database.Station.findById(body.destination).then((stationArrivee) => {
                    var temp = body.date;
                    var date = temp.split(',');
                    var dateTemp = date[0].split('/');
                    dateTemp = dateTemp[1] + '/' + dateTemp[0] + '/' + dateTemp[2];
                    console.log("API QUERY: https://timetable.search.ch/api/route.en.json?from="
                        + stationDepart.name
                        + "&to=" + stationArrivee.name
                        + "&date=" + dateTemp
                        + "&time=" + date[1].replace(/\s/g, ''))
                    axios.get("https://timetable.search.ch/api/route.en.json?from=" + stationDepart.name + "&to=" + stationArrivee.name + "&date=" + date[0] + "&time=" + date[1]).then((response) => {

                        var connectionsTrip = new Array();
                        for (var i in response.data.connections) {
                            var conn = new Connection(stationDepart.name, body.depart, stationArrivee.name, body.destination, response.data.connections[i].departure, response.data.connections[i].duration);
                            connectionsTrip.push(conn)

                        }
<<<<<<< HEAD
                        resolve(connectionsTrip);
=======

                        console.log(connectionsTrip);
                        resolve([body,connectionsTrip]);
>>>>>>> 64ce27e15d9c82a8977dd4b59718284246ab590f
                    })
                })
            })
        })
    }
}