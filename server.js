const express = require('express');
const { restart } = require('nodemon');
const { response, request } = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 3000;
const connectionString = process.env.DBSTRING;

MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then(client => {
		console.log('Connected to Database')
		const db = client.db('colors-and-votes');
	})
	.catch(error => console.error(error));

app.set('view engine', 'ejs');
app.use(cors);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
	db.collection('colors').find().sort({votes: -1}).toArray()
	.then(data => {
		response.render('index.ejs', {info: data}) //TODO: Actually configure an EJS-based index page...
	})
	.catch(error => console.error(error));
})

app.post('/newcolor', (req, res) => {
	console.log(req.body);
	db.collection('colors').insertOne({color: request.body.color, votes: 1})
	.then(result => {
		console.log(`Color ${request.body.color} added`);
		response.redirect('/');
	})
	.catch(error => console.error(error));
})

app.put('/vote', (req, res) => {
	db.collection(colors).updateOne({color: request.body.color, votes: request.body.votes},{
		$set: {
			votes:request.body.votes + 1
		}
	},{
		sort: {_id: -1},
		upsert: true
	})
	.then(result => {
		console.log(`Added one vote for color ${request.body.color}, new total is ${request.body.votes + 1}`);
		response.json('Vote tallied');
	})
	.catch(error => console.error(error));
})

app.delete('/deletecolor', (request, response) => {
	db.collection('colors').deleteOne({color: request.body.color})
	.then(result => {
		console.log(`Color ${request.body.color} has been annihilated`);
		response.json('Color deleted');
	})
	.catch(error => console.error(error));
})

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server now listening on port ${process.env.PORT || PORT}`);
})