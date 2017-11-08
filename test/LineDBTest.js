var LineDB = require('../db/LineDB');
var Line = require('../objects/Line');

var b = new Line(-1, 1, 2, 3);



LineDB.add(b).then((b) => {
    
})