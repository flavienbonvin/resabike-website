const express = require('express');
const router = express.Router();
const getBooking = require('../modules/driver/getBookingByDate');


router.use((req, res, next) => {
  if (!req.session.isConnected) {
    res.redirect('/admin/login');
  } else {
    next();
  }
});

/*
 *------------------------------------------------------------------------------------------
*/
router.get('/', (req, res, next) => {
    res.render('driver/index', { title: 'Resabike | Driver - Index' });
});

router.post('/', (req, res, next) => {
    getBooking.getBooking(req.body).then((listTrips) => {
        res.render('driver/index', { title: 'Resabike | Driver - Index', listTrips: listTrips });
    }).catch((error) => {
        res.render('driver/index', { title: 'Resabike | Driver - Index', error: error })
    })
});

/*
 *------------------------------------------------------------------------------------------
*/
router.get('/details/:id', (req, res, next) => {
    getBooking.getDetailsBooking(req.params).then((list) => {
        res.render('driver/details', { title: 'Resabike | Driver - Details', list: list });
    })

});  

module.exports = router;