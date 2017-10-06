var db = require('../modules/database');
var Role = require('../objects/Role');
var Zone = require('../objects/Zone');
var Station = require('../objects/Station');
var Line = require('../objects/Line');
var roles = [];
var stations = [];
var lines = [];


roles.push(
    new Role(1, 'Bus driver').convertToSequelize(),
    new Role(2, 'Zone admin').convertToSequelize(),
    new Role(3, 'System admin').convertToSequelize())

stations.push(
    new Station(1,"station1",15,15),
    new Station(2,"station2",15,15),
    new Station(3,"station3",15,15),
    new Station(4,"station4",15,15),
    new Station(5,"station5",15,15),
    new Station(6,"station6",15,15)
)

lines.push(
    new Line(1,1,2,1),
    new Line(2,3,4,1),
    new Line(3,5,6,1)
);


db.sync().then(() => {
    
    db.Role.bulkCreate(roles).then(() => {
        var zone = new Zone(1, 'Anniviers');
        db.Zone.create(
            zone.convertToSequelize()
        ).then(() =>{
            db.Station.bulkCreate(stations).then(() =>{
                db.Line.bulkCreate(lines).then(() =>{
                    db.close();
                })
            })
            
        })
        
    })
});