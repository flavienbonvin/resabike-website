var db = require('../database');

var self = module.exports = {
    getAllTrailer() {
        return new Promise((resolve,reject) => {
            db.Trailer.findAll({
                where: {
                    status : 0
                }
            }).then((trailers) => {
                trailers = JSON.parse(JSON.stringify(trailers));
                for(var i = 0 ;i<trailers.length;i++){
                    var datetimeTemp = new Date(trailers[i].startHour).toLocaleString().split(' ');
                    var date = datetimeTemp[0].split('-');
                    date = date[2]+'.'+date[1]+'.'+date[0];
                    var time = datetimeTemp[1].split(':');
                    time = time[0]+':'+time[1];
                    trailers[i].startHour = date+' '+time;
                }
                resolve(trailers)
            })
        })
    },

    takeTrailer(id){
        return new Promise((resolve,reject) => {
            db.Trailer.find({
                where: {
                    id : id
                }
            }).then((trailer) =>{
                
            })
        })
    },
    dontTakeTailer(id){
        return new Promise((resolve,reject) => {

        })
    }
}