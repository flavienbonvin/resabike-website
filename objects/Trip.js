var trip = class Trip {
    
        /**
         * 
         * @param {Number} id 
         * @param {Date} startHour  
         * @param {Number} idLine 
         * @param {Number} idBook 
         * @param {Number} idStartStation 
         * @param {Number} idEndStation 
         */
        constructor(id, startHour, idLine, idBook,idStartStation,idEndStation) {
            this.id = id;
            this.startHour = startHour;
            this.idLine = idLine;
            this.idBook = idBook;
            this.idStartStation = idStartStation;
            this.idEndStation = idEndStation;
        }
    
        convertToSequelize() {
            return {
                id: this.id,
                startHour: this.startHour,
                idLine: this.idLine,
                idBook: this.idBook,
                idStartStation: this.idStartStation,
                idEndStation: this.idEndStation
            }
        }
    }
    
    module.exports = trip;