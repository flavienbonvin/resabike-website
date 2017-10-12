var connection = class Connection {

    constructor(nameStationDeparture,idStationDeparture,nameStationDestination, idStationDestination, departure, tripDuration){
        this.nameStationDeparture = nameStationDeparture;
        this.idStationDeparture = idStationDeparture;
        this.nameStationDestination = nameStationDestination;
        this.idStationDestination = idStationDestination;
        var depTemp = departure.split(' ');
        var dateTemp = depTemp[0].split('-');
        dateTemp = dateTemp[2]+'.'+dateTemp[1]+'.'+dateTemp[0];
        var timeTemp = depTemp[1].split(':');
        this.departure = dateTemp+' '+timeTemp[0]+':'+timeTemp[1];
        this.tripDuration = tripDuration;
    }
}


module.exports = connection;