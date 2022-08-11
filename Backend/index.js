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



app.post('/api/keksstand', async function (req, res){
	let userdaten =  await select(db, 'userdaten'); 
	let username = req.body.username
	let user = userdaten.find(function (ZeileInDerDB){return ZeileInDerDB.username == username})
	let kekszahl = 0
	if (user != null) {
		kekszahl = user.kontostand
	}
res.send(kekszahl.toString())
})






	app.post('/api/dailyKeks', async function dailyKeks(req, res){
	let userdaten = await select(db, 'userdaten');
	let username = req.body.username
	let user = userdaten.find(function (ZeileInDerDB){return ZeileInDerDB.username == username})
	let gestern = Date.now () -1000 * 60 * 60 * 24
	if (user != null && (user.letztesZugriffsdatum ?? 1) < gestern) {
		
		user.kontostand = user.kontostand + 1
		user.letztesZugriffsdatum = Date.now()
		await update(db, 'userdaten', user)
		
	}

})



















/* Hier werden die Sprüche ausgewählt */

app.get('/api/', function (req, res) {
  res.send(`<h1>${new Date}</h1>`);
});

app.post('/api/test/', async function testspruch (req, res) {
  let sprüche = await select(db, 'Sprueche');
  let userdaten =  await select(db, 'userdaten'); 
  let username = req.body.username
  let user = userdaten.find(function (ZeileInDerDB){return ZeileInDerDB.username == username})
  let keksstand = userdaten.kontostand 
  userdaten.kontostand = userdaten.kontostand - 1
  var spruchselect = sprüche[Math.floor(Math.random() * sprüche.length)]
  res.send(spruchselect.Sprueche + '~' + spruchselect.Autor);
	user.kontostand = user.kontostand - 1
	await update(db, 'userdaten', user)
})




/* Registrierungsstuff */

app.post('/api/registrieren', async function (req, res) {

	
	const userdaten = req.body; //hat die form { Autor: "Albert Einstein", Sprueche: "e=mc²"}
	// await insert(db, 'userdaten', spruch);
	console.log(userdaten)
	// res.send('hinzugefügt');
	let Nutzername = userdaten.username // Ziehen des NUtzernamens aus dem Eingabefeld im FE und als "username"
	let email = userdaten.email // Ziehen der eingegebenem Emailadresse aus dem Eingabefeld und als "email" speichern
 	let password = userdaten.password // Passwort ziehen und als "password" speichern
	 console.log(Nutzername)
	let Nutzerdaten = await select(db, 'userdaten'); // Ziehen der Daten aus der Datenbank "userdaten" und packen dieser in den Array "Nutzerdaten" 
	let Nutzernamen = Nutzerdaten.find(elem => elem.username == Nutzername || elem.email == email) // Suchen in "Nutzerdaten" nach "Nutzername"
	console.log(Nutzernamen)
	if (Nutzernamen != null) { // Böse
		res.status(400)
		res.send('test')
	}
	else {
		res.status(200)
		res.send('tetstzdauisdih')
		let body = ({password:password, email:email, username:Nutzername, kontostand:1})
		await insert(db, 'userdaten', body)
	}

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
	let user = userdaten.find(function (x){return x.username == username})
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






