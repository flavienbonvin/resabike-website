const express = require('express');
const app = express();
const http = require('http').Server(app);
const opn = require('opn');


app.get('*', function (req, res) {
    res.sendFile(__dirname + "/client" + req.url);
});

http.listen(8080, function () {
    console.log('listening on *:8080');
    opn('http://127.0.0.1:8080')
});