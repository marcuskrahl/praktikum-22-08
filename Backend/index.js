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
		res.status(200)
		res.send('')
		
	}
	else {
		res.status(400)
		res.send('')
	}
})





app.post('/api/code', async function (req, res){
	let codes = await select (db, 'Geschenkcodes');
	let userdaten =  await select(db, 'userdaten');
	let code = req.body.code

	if (code == null) {
		res.status(400)
		res.send('')
		return
	} 
	let user = req.body.username
	if (user == null) {
		res.status(400)
		res.send('')
		return
	} 
	let finden = codes.find(function(ZeileInDerDB){return ZeileInDerDB.code == code})
	let nutzer = userdaten.find(function(ZeileInDerDB){return ZeileInDerDB.username == user})
	if (finden != null) {

			nutzer.kontostand = nutzer.kontostand + finden.codewert
			await update(db, 'userdaten', nutzer)
			await deleteRow(db, 'Geschenkcodes', finden)
			res.status(200)
			res.send('')
			
	}
	else {
		res.status(400)
		res.send('')
	}

})




app.get('/api/abfrage', async function (req, res) {
let userdaten = await select (db, 'userdaten');
res.send(userdaten)
})








/* Hier werden die Spr??che ausgew??hlt */

app.get('/api/', function (req, res) {
  res.send(`<h1>${new Date}</h1>`);
});

app.post('/api/test/', async function testspruch (req, res) {
  let spr??che = await select(db, 'Sprueche');
  let userdaten =  await select(db, 'userdaten'); 
  let username = req.body.username
  let user = userdaten.find(function (ZeileInDerDB){return ZeileInDerDB.username == username})
  let keksstand = userdaten.kontostand 
  userdaten.kontostand = userdaten.kontostand - 1
  var spruchselect = spr??che[Math.floor(Math.random() * spr??che.length)]
  res.send(spruchselect.Sprueche + '~' + spruchselect.Autor);
	user.kontostand = user.kontostand - 1
	user.ge??ffnet = user.ge??ffnet + 1
	await update(db, 'userdaten', user)
})


app.post('/api/versenden', async function (req, res){
let Daten = req.body;
let versender = Daten.versender
let Kekse = Daten.keksstand
let empf??nger = Daten.empf??nger
let userdaten = await select(db, 'userdaten');
let findenV = userdaten.find(elem => elem.username == versender)
let findenE = userdaten.find(elem => elem.username == empf??nger)
	if (findenE == null) {
		res.status(400)
		res.send('')
	return
	}
	if (findenV != null && findenE != null) {
	
		if (findenV.kontostand >= Kekse) {	

			findenE.kontostand = findenE.kontostand + Kekse
			await update(db, 'userdaten', findenE)
			findenV.verschenkt = findenV.verschenkt + Kekse
			findenV.kontostand = findenV.kontostand - Kekse
			await update(db,'userdaten',findenV)
			res.status(200)
			res.send('')
	}
	else {
	res.status(400)
	res.send('')
	}
}	
})






/* Registrierungsstuff */

app.post('/api/registrieren', async function (req, res) {

	
	const userdaten = req.body; //hat die form { Autor: "Albert Einstein", Sprueche: "e=mc??"}
	// await insert(db, 'userdaten', spruch);
	console.log(userdaten)
	// res.send('hinzugef??gt');
	let Nutzername = userdaten.username // Ziehen des NUtzernamens aus dem Eingabefeld im FE und als "username"
	let email = userdaten.email // Ziehen der eingegebenem Emailadresse aus dem Eingabefeld und als "email" speichern
 	let password = userdaten.password // Passwort ziehen und als "password" speichern
	 console.log(Nutzername)
	let Nutzerdaten = await select(db, 'userdaten'); // Ziehen der Daten aus der Datenbank "userdaten" und packen dieser in den Array "Nutzerdaten" 
	let Nutzernamen = Nutzerdaten.find(elem => elem.username == Nutzername || elem.email == email) // Suchen in "Nutzerdaten" nach "Nutzername"
	console.log(Nutzernamen)
	if (Nutzernamen != null) { // B??se
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
// 	alert('Dein gew??hltes Passwort ist nicht sicher genug!')
// }
// else if (password == 123456) {
// 	alert('Dein gew??hltes Passwort ist nicht sicher genug!')
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

