var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*', function(req, res, next) {
   
    var url = req.url.split('?')[0];
    var servicePath = __dirname+"/../services" + url;
    var temp = require(servicePath);  
    temp(req.query).then((response) =>{
        res.send(response)
    })
});

router.post('/*', function(req, res, next) {
    
     var url = req.url.split('?')[0];
     var servicePath = __dirname+"/../services" + url;
     var temp = require(servicePath);  
     temp(req.body).then((response) =>{
         res.send(response)
     })
 });


module.exports = router;
