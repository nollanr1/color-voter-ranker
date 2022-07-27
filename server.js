const express = require('express');
//const { restart } = require('nodemon');
const cors = require('cors'); //TODO: Figure out if I actually need CORS or not, since it seems to break my dev build...
require('dotenv').config();
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 3000;
const connectionString = process.env.DBSTRING;

let db, dbName = 'colors-and-votes';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then(client => {
		console.log('Connected to Database')
		db = client.db(dbName);
	})
	.catch(error => console.error(error));

app.set('view engine', 'ejs');
if(process.env.PORT){
	app.use(cors);
} //Use CORS if and only if this isn't localhost
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
	db.collection('colors').find().sort({votes: -1}).toArray()
	.then(data => {
		res.render('index.ejs', {info: data})
	})
	.catch(res.send(error || 'It broke and the error is blank?')/*error => console.error(error)*/);
})

app.post('/newcolor', (req, res) => {
	console.log(req.body);
	db.collection('colors').insertOne({color: req.body.color, votes: 1})
	.then(result => {
		console.log(`Color ${req.body.color} added`);
		res.redirect('/');
	})
	.catch(error => console.error(error));
})

app.put('/vote', (req, res) => {
	db.collection('colors').updateOne({color: req.body.color, votes: Number(req.body.votes)},{
		$set: {
			votes: (Number(req.body.votes) + 1)
		}
	},{
		sort: {_id: -1},
		upsert: true
	})
	.then(result => {
		console.log(`Added one vote for color ${req.body.color}, new total is ${Number(req.body.votes) + 1}`);
		res.json('Vote tallied');
	})
	.catch(error => console.error(error));
})

app.delete('/deletecolor', (req, res) => {
	db.collection('colors').deleteOne({color: req.body.color, votes: Number(req.body.votes)})
	.then(result => {
		console.log(`Color ${req.body.color} has been annihilated, all ${req.body.votes} votes lost like tears in the rain`);
		res.json('Color deleted');
	})
	.catch(error => console.error(error));
})

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server now listening on port ${process.env.PORT || PORT}`);
})