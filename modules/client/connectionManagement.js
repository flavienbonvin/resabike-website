var axios = require('axios');
var Connection = require("../../objects/Connection");

module.exports = {

    getConnectionForTrip(body) {
        return new Promise((resolve, reject) => {
            console.log("API QUERY: https://timetable.search.ch/api/route.en.json?from=" + body.from + "&to=" + body.to)
            axios.get("https://timetable.search.ch/api/route.en.json?from=" + body.from + "&to=" + body.to).then((response) => {
                
                var connectionsTrip = new Array();
                for (var i in response.data.connections){
                    var conn = new Connection(response.data.connections[i].departure.split(" ")[1], response.data.connections[i].duration);
                    connectionsTrip.push(conn)
                }
                
                resolve(connectionsTrip);
            })
        })
    }
}