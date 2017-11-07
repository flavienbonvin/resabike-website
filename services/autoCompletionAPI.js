const axios = require('axios');

/**
 * Return the text of the autocompletion of the API
 * 
 * @param {string} getData 
 */
module.exports = function (getData) {
    return new Promise((resolve,reject) =>{
        var part = getData.part;
        axios.get('https://timetable.search.ch/api/completion.en.json?term=' + part).then((response) => {
            var res = [];
            for(var i = 0;i<response.data.length;i++){
                res.push(response.data[i].label);
            }
            
            resolve(res);
        })
        
    })
    
}
