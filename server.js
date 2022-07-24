const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 3000;
const dbuser = process.env.DBUSER;
const passphrase = process.env.DBPASSPHRASE;
const connectionString = `mongodb+srv://${dbuser}:${passphrase}@colors-and-votes.ioosw.mongodb.net/?retryWrites=true&w=majority`

app.use(bodyParser.urlencoded({ extended: true}));

MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then(client => {
		console.log('Connected to Database')
	})
	.catch(error => console.error(error));

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
})

app.post('/newcolor', (req, res) => {
	console.log(req.body);
	res.sendFile(`${__dirname}/index.html`); //TODO: Redirect. Or don't move at all...
})

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server now listening on port ${process.env.PORT || PORT}`);
})