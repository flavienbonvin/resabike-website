const express = require('express');
const router = express.Router();
const lineManagement = require('../modules/admin/lineManagement');
const userManagement = require('../modules/admin/userManagement');


/* GET home page. */
router.get('/addLine', (req, res, next) => {
  res.render('admin/addLine', { title: 'Express' });
});

router.post('/addLine', (req, res, next) => {
  lineManagement.getStopsForLine(req.body.depart, req.body.arrivee).then((stops) => {
    res.render('admin/addLine', { title: 'Express', stops: stops });
  }).catch((error) => {
    console.log(error);
    if (Array.isArray(error)) {
      res.render('admin/addLine', { title: 'Express', error: error[0], lineSuggestions: error[1] });
    } else {
      
      res.render('admin/addLine', { title: 'Express', error: error });
    }

  })
});

router.post('/addLine/add', (req, res, next) => {
  lineManagement.prepareStation(req.body).then((msg) => {
    res.render('admin/addLine', { title: 'Add Line', msg: 'Added' })
  }).catch((error) => {
    res.render('admin/addLine', { title: 'Add Line', error: error });
  })
});

router.get('/addUser', (req, res, next) => {
  res.render('admin/addUser', { title: 'Express' });
});

router.post('/addUser', (req, res, next) => {
  userManagement.createUser(req.body).then(() => {
    res.render('admin/addUser', { title: 'Express' });
  }).catch((error) => {
    res.render('admin/addUser', { title: 'Add user', error: error });
  });
});

router.get('/addZone', (req, res, next) => {
  res.render('admin/addZone', { title: 'Express' })
})

module.exports = router;
