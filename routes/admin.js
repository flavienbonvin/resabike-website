const express = require('express');
const router = express.Router();
const lineManagement = require('../modules/admin/lineManagement');
const userManagement = require('../modules/admin/userManagement');
const zoneManagement = require('../modules/admin/zoneManagement');
const trailerManagement = require('../modules/admin/trailerManagement');
const loginManagement = require('../modules/admin/loginManagement');
const bookManagement = require('../modules/client/bookManagement');

const User = require('../objects/User');



router.use((req, res, next) => {
  console.log(req.url)
  if (!req.session.isConnected && req.url != '/login') {
    res.redirect('/' + res.locals.langUsed + '/admin/login');
  } else if (req.url == '/logout') {
    next()
  } else if (req.url != '/login' && req.session.userInfo.idRole == 1) {
    res.redirect('/' + res.locals.langUsed + '/driver');
  } else {
    next();
  }
});


/*
 *------------------------------------------------------------------------------------------
*/
//ADMIN PAGES
router.get('/', (req, res, next) => {
  zoneManagement.listWithDetails(req.session.userInfo).then((details) => {
    res.locals.noOnglet = 0;
    res.render('admin/index', { title: 'Resabike | Admin - Index', listZone: details });
  })
});

router.get('/index*', (req, res, next) => {
  zoneManagement.listWithDetails(req.session.userInfo).then((details) => {
    res.locals.noOnglet = 0;
    res.render('admin/index', { title: 'Resabike | Admin - Index', listZone: details });
  }).catch((error) => {
    console.error(error);
  })
});

/*
 *------------------------------------------------------------------------------------------
*/
//LINE PAGES
router.get('/line/add', (req, res, next) => {
  res.locals.noOnglet = 1;
  res.render('admin/addLine', { title: 'Resabike | Admin - Add line', add: true  });
});

router.post('/line/preview', (req, res, next) => {
  res.locals.noOnglet = 1;
  lineManagement.getStopsForLine(req.body.depart, req.body.arrivee).then((stops) => {
    res.render('admin/addLine', { title: 'Resabike | Admin - Preview', stops: stops[0] });
  }).catch((error) => {
    if (Array.isArray(error)) {
      res.render('admin/addLine', { title: 'Resabike | Admin - Preview', error: error[0], lineSuggestions: error[1] });
    } else {
      res.render('admin/addLine', { title: 'Resabike | Admin - Preview', error: error });
    }

  })
});

router.post('/line/add', (req, res, next) => {
  res.locals.noOnglet = 1;
  lineManagement.prepareStation(req.body).then((msg) => {
    res.render('admin/addLine', { title: 'Resabike | Admin - Add Line', msg: 'Added' })
  }).catch((error) => {
    res.render('admin/addLine', { title: 'Resabike | Admin - Add Line', error: error });
  })
});

router.post('/line/delete', (req, res, next) => {
  res.locals.noOnglet = 0;
  lineManagement.deleteLine(req.body).then(() => {
    res.sendStatus(200);
  })
})

/*
 *------------------------------------------------------------------------------------------
*/
//USER PAGES
router.get('/user/add', (req, res, next) => {
  res.locals.noOnglet = 2;
  res.render('admin/addUser', { title: 'Resabike | Admin - Add User', user: new User() });
});

router.post('/user/add', (req, res, next) => {
  res.locals.noOnglet = 2;
  userManagement.createUser(req.body).then((response) => {
    //if (response == "update") {
    res.redirect('/' + res.locals.langUsed + '/admin/users')
    //} else {
    //res.render('admin/addUser', { title: 'Add user', msg: response, user: new User() });
    //}

  }).catch((error) => {
    res.render('admin/addUser', { title: 'Resabike | Admin - Add User', error: error, user: new User() });
  });
});

router.get('/users', (req, res, next) => {
  res.locals.noOnglet = 3;
  res.render('admin/manageUsers', { title: 'Resabike | Admin User'});
});

router.post('/users/delete', (req, res, next) => {
  res.locals.noOnglet = 3;
  userManagement.deleteUser(req.body).then(() => {
    res.send('');
  }).catch((error) => {
    res.render('admin/manageUsers', { title: 'Resabike | Admin - User Delete', error: error })
  })
});

router.get('/users/edit/:id', (req, res, next) => {
  res.locals.noOnglet = 3;
  userManagement.getUser(req.params.id).then((user) => {
    res.render('admin/addUser', { title: 'Resabike | Admin - Edit User', user: user });
  })
});

/*
 *------------------------------------------------------------------------------------------
*/
//ZONE PAGES
router.get('/zone', (req, res, next) => {
  res.locals.noOnglet = 6;
  res.render('admin/zone', { title: 'Resabike | Admin - Zone' })
});

router.post('/zone', (req, res, next) => {
  res.locals.noOnglet = 6;
  zoneManagement.createZone(req.body).then(() => {
    res.render('admin/zone', { title: 'Resabike | Admin - Create Zone' })
  }).catch((error) => {
    res.render('admin/zone', { title: 'Resabike | Admin - Create Zone', error: error })
  })
});

router.post('/zone/delete', (req, res, next) => {
  res.locals.noOnglet = 6;
  zoneManagement.deleteZone(req.body).then(() => {
    res.send('');
  }).catch((error) => {
    res.render('admin/zone', { title: 'Resabike | Admin Zone Delete', error: error })
  })
});

router.post('/zone/update', (req, res, next) => {
  res.locals.noOnglet = 6;
  zoneManagement.updateZone(req.body).then(() => {
    res.send('');
  }).catch((error) => {
    console.error(error);
  })
})

/*
 *------------------------------------------------------------------------------------------
*/
//REMORQUE PAGES
router.get('/remorques', (req, res, next) => {
  res.locals.noOnglet = 5;
  trailerManagement.getAllTrailer().then((trailers) => {
    res.render('admin/remorques', { title: 'Resabike | Admin - Trailer', trailers: trailers });
  })
});

router.get('/remorques/allocate/:id', (req, res, next) => {
  res.locals.noOnglet = 5;
  trailerManagement.takeTrailer(req.params.id).then(() => {
    res.redirect('/' + res.locals.langUsed + '/admin/remorques')
  })
});

router.get('/remorques/unallocate/:id', (req, res, next) => {
  res.locals.noOnglet = 5;
  trailerManagement.dontTakeTailer(req.params.id).then(() => {
    res.redirect('/' + res.locals.langUsed + '/admin/remorques')
  })
});


/*
 *------------------------------------------------------------------------------------------
*/
//LOGIN PAGE
router.get('/login', (req, res, next) => {
  res.render('admin/login', { title: 'Resabike | Admin - Login' });
});

router.post('/login', (req, res, next) => {
  loginManagement.login(req.body, req.session).then(() => {
    if (req.session.userInfo.idRole == 1) {
      res.redirect('/' + res.locals.langUsed + '/driver');
    } else {
      res.redirect('/' + res.locals.langUsed + '/admin');
    }
  }).catch(() => {
    res.render('admin/login', { title: "Resabike | Admin - Login", error: "wrong password" })
  })
});

/*
 *------------------------------------------------------------------------------------------
*/
//LOGOUT PAGE
router.get('/logout', (req, res, next) => {
  console.log(req.session);
  loginManagement.logout(req.session);
  console.log(req.session);
  res.redirect('/' + res.locals.langUsed + '/admin');
});

/*
 *------------------------------------------------------------------------------------------
*/
//BOOK PAGE
router.get('/book', (req, res, next) => {
  bookManagement.findAllBooking().then((bookList) => {
    res.locals.noOnglet = 4;
    res.render('admin/manageBooking', { title: "Resabike | Admin - Book", bookList: bookList })
  })
});



module.exports = router;