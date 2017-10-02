var express = require('express');
var router = express.Router();
const adminApiConn = require('../modules/adminApiConn');
const sysAdminConn = require('../modules/sysAdminAccount');

const addUser = require('../modules/sysAdminAccount');

var User = require('../objects/User')

/* GET home page. */
router.get('/addLine', (req, res, next) => {
  res.render('addLine', { title: 'Express' });
});

router.post('/addLine', (req, res, next) => {
  console.log(req.body)
  adminApiConn.getStopsForLine(req.body.depart, req.body.arrivee).then((stops) => {
    res.render('addLine', { title: 'Express', stops: stops });
  }).catch((error) => {
    res.render('addLine', { title: 'Express', error: error[0], lineSuggestions: error[1] });
  })
});

router.post('/addLine/add', (req, res, next) => {
  console.log(req.body);
  //TODO: refactoriser le router
  adminApiConn.getStopsForLine(req.body.departFinal, req.body.arriveeFinal).then((stops) => {
    adminApiConn.insertStationInDB(stops).then((msg) => {
      res.render('addLine', { title: 'Add Line', msg: 'Added' })
    }).catch((error) => {
      res.render('addLine', { title: 'Add Line', error: error });
    })
  }).catch((error) => {
    res.render('addLine', { title: 'Add Line', error: error });
  })
});

router.get('/addUser', (req, res, next) => {
  res.render('addUser', { title: 'Express' });
});

router.post('/addUser', (req, res, next) => {
  console.log(req.body);

  var resetPass = false;
  if (req.body.passwordReset) {
    resetPass = true;
  }
  //TODO: add the zone ID, get from dropdown (temporary 1)
  var user = new User(null, req.body.role, req.body.username, req.body.password, req.body.email, resetPass, 1);
  addUser.createUser(user).then(() => {
    res.render('addUser', { title: 'Express' });
  }).catch((error) => {
    res.render('addUser', {title: 'Add user', error: error});
  });
});

//TODO: est ce que c'est utile?
/*
router.post('/addUser/add', (req, res, next) => {
  console.log(req.body.username + ' ' + req.body.email + ' ' + req.body.password);
  res.render('addUser', {title: 'Express'});
});
*/

router.get('/addZone', (req, res, next) => {
  res.render('addZone', { title: 'Express' })
})

module.exports = router;
