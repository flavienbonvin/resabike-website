const express = require('express');
const router = express.Router();
const getBooking = require('../modules/driver/getBookingByDate');

router.get('/', (req, res, next) => {
    res.render('driver/index', { title: 'Express' });
})
router.post('/', (req, res, next) => {
    getBooking.getBooking(req.body).then((listTrips) => {
        res.render('driver/index', { title: 'Express', listTrips: listTrips });
    }).catch((error) => {
        res.render('driver/index', { title: 'Express', error: error })
    })
})
router.get('/details/:id', (req, res, next) => {
    getBooking.getDetailsBooking(req.params).then((list) => {
        res.render('driver/details', { title: 'Express', list: list });
    })

})

module.exports = router;