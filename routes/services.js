var express = require('express');
var router = express.Router();

router.get('/*', function (req, res, next) {

    var url = req.url.split('?')[0];
    var servicePath = __dirname + "/../services" + url;
    var temp = require(servicePath);
    temp(req.query, req.session).then((response) => {
        res.send(response)
    })
});

router.post('/*', function (req, res, next) {
    var url = req.url.split('?')[0];
    var servicePath = __dirname + "/../services" + url;
    var temp = require(servicePath);
    temp(req.body, req.session).then((response) => {
        res.send(response)
    }).catch((error) => {
        console.log(error)
    })
});


module.exports = router;
