const express = require('express');
const router = express.Router();
const lineManagement = require('../modules/admin/lineManagement');
const userManagement = require('../modules/admin/userManagement');
const zoneManagement = require('../modules/admin/zoneManagement');
const trailerManagement = require('../modules/admin/trailerManagement');
const loginManagement = require('../modules/admin/loginManagement');

const User = require('../objects/User');



router.use((req, res, next) => {
  if (!req.session.isConnected && req.url != '/login') {
    res.redirect('/admin/login');
  } else if (req.url != '/login' && req.session.userInfo.idRole == 1) {
    res.redirect('/driver');
  } else {
    next();
  }
})

//TODO: page de détail pour lignes


/*
 *------------------------------------------------------------------------------------------
*/
router.get('/', (req, res, next) => {
  zoneManagement.listWithDetails().then((details) => {
    res.render('admin/index', { title: 'Admin index', listZone: details });
  })
});

router.get('/index*', (req, res, next) => {
  zoneManagement.listWithDetails().then((details) => {
    res.render('admin/index', { title: 'Admin index', listZone: details });
  }).catch((error) => {
    console.error(error);
  })
});

/*
 *------------------------------------------------------------------------------------------
*/
/* GET home page. */
router.get('/line/add', (req, res, next) => {
  res.render('admin/addLine', { title: 'Express' });
});

router.post('/line/preview', (req, res, next) => {
  lineManagement.getStopsForLine(req.body.depart, req.body.arrivee).then((stops) => {
    res.render('admin/addLine', { title: 'Express', stops: stops[0] });
  }).catch((error) => {
    if (Array.isArray(error)) {
      res.render('admin/addLine', { title: 'Express', error: error[0], lineSuggestions: error[1] });
    } else {
      res.render('admin/addLine', { title: 'Express', error: error });
    }

  })
});
router.post('/line/add', (req, res, next) => {
  lineManagement.prepareStation(req.body).then((msg) => {
    res.render('admin/addLine', { title: 'Add Line', msg: 'Added' })
  }).catch((error) => {
    res.render('admin/addLine', { title: 'Add Line', error: error });
  })
});
router.post('/line/delete', (req, res, next) => {
  lineManagement.deleteLine(req.body).then(() => {
    res.sendStatus(200);
  })
})

/*
 *------------------------------------------------------------------------------------------
*/
router.get('/user/add', (req, res, next) => {
  res.render('admin/addUser', { title: 'Add user', user: new User() });
});
router.post('/user/add', (req, res, next) => {
  userManagement.createUser(req.body).then(() => {
    res.render('admin/addUser', { title: 'Add user', msg: 'Added', user: new User() });
  }).catch((error) => {
    res.render('admin/addUser', { title: 'Add user', error: error, user: new User() });
  });
});
router.get('/users', (req, res, next) => {
  res.render('admin/manageUsers');
})
router.post('/users/delete', (req, res, next) => {
  userManagement.deleteUser(req.body).then(() => {
    res.send('');
  }).catch((error) => {
    res.render('admin/manageUsers', { title: 'Express', error: error })
  })
})
router.post('/users/reset', (req, res, next) => {
  userManagement.resetPassword(req.body).then(() => {
    res.send();
  }).catch((error) => {
    res.render('admin/manageUsers', { title: 'Express', error: error })
  })
})
router.get('/users/edit/:id', (req, res, next) => {
  userManagement.getUser(req.params.id).then((user) => {
    res.render('admin/addUser', { title: 'Edit user', user: user });
  })
})

/*
 *------------------------------------------------------------------------------------------
*/
router.get('/zone', (req, res, next) => {
  res.render('admin/zone', { title: 'Express' })
})
router.post('/zone', (req, res, next) => {
  zoneManagement.createZone(req.body).then(() => {
    res.render('admin/zone', { title: 'Express' })
  }).catch((error) => {
    res.render('admin/zone', { title: 'Express', error: error })
  })
})
router.post('/zone/delete', (req, res, next) => {
  zoneManagement.deleteZone(req.body).then(() => {
    res.send('');
  }).catch((error) => {
    res.render('admin/zone', { title: 'Express', error: error })
  })
})
router.post('/zone/update', (req, res, next) => {
  zoneManagement.updateZone(req.body).then(() => {
    res.send('');
  }).catch((error) => {
    console.error(error);
  })
})


router.get('/remorques', (req, res, next) => {
  trailerManagement.getAllTrailer().then((trailers) => {
    res.render('admin/remorques', { title: 'express', trailers: trailers });
  })
})

router.get('/login', (req, res, next) => {
  res.render('admin/login', { title: 'Express' });
})
router.post('/login', (req, res, next) => {
  loginManagement.login(req.body, req.session).then(() => {
    if (req.session.userInfo.idRole == 1) {
      res.redirect('/driver');
    } else {
      res.redirect('/admin');
    }
  }).catch(() => {
    res.render('admin/login', { title: "express", error: "wrong password" })
  })
})
router.get('/logout', (req, res, next) => {
  loginManagement.logout();
  res.redirect('/admin');
})
module.exports = router;