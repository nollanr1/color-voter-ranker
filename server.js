const express = require('express');
const app = express();

const PORT = 3000;

console.log('Grabbing ahold of bootstraps...');

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server now listening on port ${process.env.PORT || PORT}`);
})