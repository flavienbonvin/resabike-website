var express = require('express');
var router = express.Router();

const database = require('../modules/database')
const Station = require('../objects/Station');
const connectionManagement = require('../modules/client/connectionManagement');
const bookManagement = require('../modules/client/bookManagement');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('client/index', { title: 'Express' });
});

router.post('/book/add', function (req, res, next) {
  connectionManagement.getConnectionForTrip(req.body).then((list) => {
    res.render('client/index', { title: 'express', listHoraire: list })
  }).catch((error) => {
    res.render('client/index', { title: 'Express', error: error });
  })
})
router.post('/book/reserve', function (req, res, next) {
  bookManagement.addBook(req.body,res.locals.langUsed).then((list) => {
    res.render('client/index', { title: 'express', msg: 'reservation ajouté' })
  })
})
router.get('/book/cancel/:id', function (req, res, next) {
  bookManagement.findBooking(req.params.id).then((book) => {
    res.render('client/cancelBooking', { title: 'Express', book: book });
  }).catch((error) => {
    res.render('client/cancelBooking', { title: 'Express', error: error });
  })
})
router.post('/book/cancel/:id', function (req, res, next) {
  bookManagement.deleteBooking(req.params.id).then(() => {
    res.redirect('/');
  })
})


router.get('/about', function(req, res, next){
  res.render('client/about')
})


module.exports = router;
