var BookDB = require('../db/BookDB');
var Book = require('../objects/Book');

var b = new Book(-1,1,1,2,'max','max@max.ch',2,new Date(),'montoken')

console.log('Ajout d\'une reservation');
BookDB.add(b).then((b) =>{
    console.log('Reservation ajouté');
    console.log('listing des éléments')
    BookDB.get(b.id).then((b) => {
        console.log(b);
        BookDB.getAll().then((books) => {
            console.log(books);
            console.log('suppression de l\'élément ajouté avec id = '+b.id);
            BookDB.delete(b.id).then(() =>{
                console.log('suppression réussi');
                BookDB.close();
            })
        })
    })
   
    
})