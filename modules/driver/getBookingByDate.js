var database = require('../database');

module.exports = {

    getBooking(body) {

        return new Promise((resolve, reject) => {
            var date = new Date();
            database.Trips.findAll({
                where: {
                    idLine: body.lineDropdown
                }, 
                include: [
                    {
                        model: database.Book
                    },
                    {
                        model: database.Station,
                        as: 'startStationTrip'
                    },
                    {
                        model: database.Station,
                        as: 'endStationTrip'
                    },
                    {
                        model: database.Line
                    }
                ]
            }).then((tripLists) => {
                console.log('--------------------------------------------------------------------------------')
                console.log(tripLists)
                console.log('--------------------------------------------------------------------------------')
            })
        })
    }
}