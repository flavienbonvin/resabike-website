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
        constructor(id,lineStartHour, startHour, idLine, idBook,idStartStation,idEndStation,status) {
            this.id = id;
            this.lineStartHour =lineStartHour;
            this.startHour = startHour;
            this.idLine = idLine;
            this.idBook = idBook;
            this.idStartStation = idStartStation;
            this.idEndStation = idEndStation;
            this.status = status;
        }
    
        convertToSequelize() {
            return {
                id: this.id,
                lineStartHour: this.lineStartHour,
                startHour: this.startHour,
                idLine: this.idLine,
                idBook: this.idBook,
                idStartStation: this.idStartStation,
                idEndStation: this.idEndStation,
                status : this.status
            }
        }
    }
    
    module.exports = trip;