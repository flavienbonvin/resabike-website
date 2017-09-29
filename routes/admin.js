var express = require('express');
var router = express.Router();
const adminApiConn = require('../modules/adminApiConn');

/* GET home page. */
router.get('/addLine', function (req, res, next) {
  res.render('addLine', { title: 'Express' });
});
router.post('/addLine', function (req, res, next) {
  console.log(req.body)
  adminApiConn.getStopsForLine(req.body.depart, req.body.arrivee).then((stops) => {
    res.render('addLine', { title: 'Express', stops: stops });
  }).catch((error) => {
    res.render('addLine', { title: 'Express', error: error });
  })
});
router.post('/addLine/add', function (req, res, next) {
  adminApiConn.getStopsForLine(req.body.departFinal, req.body.arriveeFinal).then((stops) => {
    adminApiConn.insertLineInDB(stops).then((msg) => {
      res.render('addLine', { title: 'Add Line', msg: 'Added' })
    })
  }).catch((error) => {
    res.render('addLine', { title: 'Express', error: error });
  })
})

module.exports = router;
