var connection = class Connection {

    constructor(idStationDeparture, idStationDestination, departure, tripDuration){
        this.idStationDeparture = idStationDeparture;
        this.idStationDestination = idStationDestination;
        this.departure = departure;
        this.tripDuration = tripDuration;
    }
}


module.exports = connection;