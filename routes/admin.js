var express = require('express');
var router = express.Router();
const adminApiConn = require('../modules/adminApiConn');
const sysAdminConn = require('../modules/sysAdminAccount');

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
    res.render('addLine', { title: 'Express', error: error[0], lineSuggestions:error[1] });
  })
});

router.post('/addLine/add', (req, res, next) => {
  console.log(req.body);
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
  res.render('addUser', {title: 'Express'});
});

router.post('/addUser', (req, res, next) => {
  console.log(req.body);

  var resetPass = false;
  if (req.body.passwordReset)
    resetPass = true;

  switch (req.body.role){
    //Create bus driver 
    case '1':
        sysAdminConn.createDriver(req.body.username, req.body.password, req.body.email, resetPass, 1)
        .then(() => {
          res.render('addUser', {title: 'Express'});
        })
        break;
    //Create zone admin
    case '2':
        sysAdminConn.createZoneAdmin(req.body.username, req.body.password, req.body.email, resetPass, 1)
        .then(() => {
          res.render('addUser', {title: 'Express'});
        })
        break;
    //Create system admin
    case '3':
        sysAdminConn.createSystemAdmin(req.body.username, req.body.password, req.body.email, resetPass, 1)
        .then(() => {
          res.render('addUser', {title: 'Express'});
        })
        break;
  }
});

//TODO: est ce que c'est utile?
/*
router.post('/addUser/add', (req, res, next) => {
  console.log(req.body.username + ' ' + req.body.email + ' ' + req.body.password);
  res.render('addUser', {title: 'Express'});
});
*/

module.exports = router;
