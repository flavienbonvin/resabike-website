var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*', function(req, res, next) {
    var url = req.url.split('?')[0];
    var temp = require(__dirname + url);
    console.log(temp)    
    temp(req.query).then((response) =>{
        res.send(response)
    })
});

module.exports = router;
