var BookDB = require('../db/BookDB');
var Book = require('../objects/Book');

var b = new Book(-1,1,1,2,'max','max@max.ch',2,new Date(),'montoken')


BookDB.add(b).then((b) =>{
    
    
    BookDB.get(b.id).then((b) => {
        
        BookDB.getAll().then((books) => {
            
            
            BookDB.delete(b.id).then(() =>{
                
                BookDB.close();
            })
        })
    })
   
    
})
