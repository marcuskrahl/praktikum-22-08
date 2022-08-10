/*
 * BACKEND 
 */

const express = require('express')
const app = express()
const port = 8080
const sqlite3 = require('sqlite3').verbose();
const { select, insert, update, deleteRow} = require('./db_utilities');
const db = new sqlite3.Database('Datenbank/daten.sqlite');
const templateMiddleware = require('./template_middleware');

app.use(express.json())


/* Hier werden die Sprüche ausgewählt */

app.get('/api/', function (req, res) {
  res.send(`<h1>${new Date}</h1>`);
});

app.get('/test/', async function testspruch (req, res) {
  let sprüche = await select(db, 'Sprueche');

  var spruchselect = sprüche[Math.floor(Math.random() * sprüche.length)]
  res.send(spruchselect.Sprueche + '~' + spruchselect.Autor);
})


/* Registrierungsstuff */

app.post('/api/registrieren', async function (req, res) {

	
	const userdaten = req.body; //hat die form { Autor: "Albert Einstein", Sprueche: "e=mc²"}
	// await insert(db, 'userdaten', spruch);
	console.log(userdaten)
	res.send('hinzugefügt');
	let Nutzername = userdaten.username // Ziehen des NUtzernamens aus dem Eingabefeld im FE und als "username"
	let email = userdaten.email // Ziehen der eingegebenem Emailadresse aus dem Eingabefeld und als "email" speichern
 	let password = userdaten.password // Passwort ziehen und als "password" speichern
	 console.log(username)
	let Nutzerdaten = await select(db, 'userdaten'); // Ziehen der Daten aus der Datenbank "userdaten" und packen dieser in den Array "Nutzerdaten" 
	let Nutzernamen = Nutzerdaten.find(elem => elem.username = Nutzername) // Suchen in "Nutzerdaten" nach "Nutzername"
	console.log(Nutzernamen)

	})


	
   



//   if (password === '12345678') {
// 	alert('Dein gewähltes Passwort ist nicht sicher genug!')
// }
// else if (password == 123456) {
// 	alert('Dein gewähltes Passwort ist nicht sicher genug!')
// }

// if (username == "" ) { //* x = Datenabfrage in DB*//
// 	alert('Dieser Nutzername ist bereits vergeben')
// }
// if (email == 'test') {
// 	alert('Diese Emailadresse wird bereits verwendet!')
// }







//* Hier beginnen die Loginsachen

app.post('/api/login', async (req, res) => {
	let userdaten = await select(db, 'userdaten');  // ALLE Nutzerdaten aus der Datenbank holen und in Array "userdaten" packen
	let password = req.body.password
	let username = req.body.username
	let user = userdaten.find(function (x){x.username == username})
	if (user != null && password == user.password){
		res.send("passt")
	}
	else {
		res.status (401)
		res.send ("passt nicht")
	}
});


/* Hier enden die Backend Methoden */


app.use(templateMiddleware);

app.use(express.static('Frontend'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// db.close();






