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
                    console.log(body.date)
                    console.log("API QUERY: https://timetable.search.ch/api/route.en.json?from=" + stationDepart.name + "&to=" + stationArrivee.name)
                    axios.get("https://timetable.search.ch/api/route.en.json?from=" + stationDepart.name + "&to=" + stationArrivee.name).then((response) => {

                        var connectionsTrip = new Array();
                        for (var i in response.data.connections) {
                            var conn = new Connection(body.depart, body.destination, response.data.connections[i].departure, response.data.connections[i].duration);
                            connectionsTrip.push(conn)
                            
                        }

                        console.log(connectionsTrip);
                        resolve(connectionsTrip);
                    })
                })
            })
        })
    }
}