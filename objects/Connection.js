var connection = class Connection {

    /**
     * 
     * @param {String} nameStationDeparture 
     * @param {Number} idStationDeparture 
     * @param {String} nameStationDestination 
     * @param {Number} idStationDestination 
     * @param {String[]} departure 
     * @param {Number} tripDuration 
     * @param {String} tripsInfo 
     */
    constructor(nameStationDeparture,idStationDeparture,nameStationDestination, idStationDestination, departure, tripDuration, tripsInfo){
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
        this.tripsInfo = tripsInfo
    }
}


module.exports = connection;