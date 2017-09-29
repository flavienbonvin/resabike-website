var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/addLine', function(req, res, next) {
  res.render('addLine', { title: 'Express' });
});

module.exports = router;
