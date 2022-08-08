/*
 * BACKEND 
 */









const express = require('express')
const app = express()
const port = 8080
const sqlite3 = require('sqlite3').verbose();
const { select, insert, update, deleteRow} = require('./db_utilities');
const db = new sqlite3.Database('Datenbank/daten.sqlite');

app.use(express.json())


/* Hier beginnen die Backend Methoden - erreichbar unter http://localhost:8080/api */

app.get('/api/', function (req, res) {
  res.send(`<h1>${new Date}</h1>`);
});

app.get('/test/', async function testspruch (req, res) {
  let sprüche = await select(db, 'Sprueche');

  var spruchselect = sprüche[Math.floor(Math.random() * sprüche.length)]
  res.send(spruchselect.Sprueche + '~' + spruchselect.Autor);
})

// app.post('/api/login', async (req, res) => {
// 	let userdaten = await select(db, 'userdaten');
// 	let password = req.body.password
// 	let username = req.body.username
// 	let user = userdaten.find(x => x.username == username)
// 	if (user != null && password == user.password){
// 		res.send("passt")
// 	}
// 	else {
// 		res.status (401)
// 		res.send ("passt nicht")
// 	}
// });

/* Hier enden die Backend Methoden */

app.use(express.static('Frontend'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// db.close();






