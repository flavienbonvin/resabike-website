const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const http = require('http').Server(app);
const opn = require('opn');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('node_modules/semantic-ui-css'));

app.get('/services/*', function (req, res) {
    var url = req.url.split('?')[0];
    var temp = require(__dirname + url);
    temp(req.query).then((response) =>{
        res.send(response)
    })
})

app.get('*', function (req, res) {
    res.sendFile(__dirname + "/public" + req.url);
});

http.listen(8080, function () {
    console.log('listening on *:8080');
    opn('http://127.0.0.1:8080')
});