var express = require('express');
var router = express.Router();

const database = require('../modules/database')
const Station = require('../objects/Station');
const connectionManagement = require('../modules/client/connectionManagement');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('client/index', { title: 'Express' });
});

router.post('/book/add', function (req, res, next) {
  console.log(req.body)
  connectionManagement.getConnectionForTrip(req.body).then((list) => {
    res.render('client/index', { title: 'express', listHoraire: list })
  })
})

module.exports = router;
