const express = require('express');
const router = express.Router();
const getBooking = require('../modules/driver/getBookingByDate');

router.get('/', (req, res, next) => {
    res.render('driver/index', { title: 'Express'});
})
router.post('/', (req, res, next) => {
    getBooking.getBooking(req.body).then((listTrips)=> {
        res.render('driver/index', {title: 'Express', listTrips: listTrips});
    })
})

module.exports = router;