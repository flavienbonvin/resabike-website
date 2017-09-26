var LineDB = require('../db/LineDB');
var Line = require('../objects/Line');

var b = new Line(-1, 1, 2, 3);

console.log('Ajout d\'une line');

LineDB.add(b).then((b) => {
    console.log(b)
})