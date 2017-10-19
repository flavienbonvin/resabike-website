var email = require('./modules/email');

email.createEmail('maxime.betrisey@jehegt.ch','test','<p>salut<p>').then(() =>{
    console.log('ok');
})