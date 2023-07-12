const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

app.use(cors());

require('./configs/database.js');

const signController = require('./controllers/signController.js');
const gameController = require('./controllers/gameController.js');

app.use(bodyParser.urlencoded({extended : true}))
.use(bodyParser.json());

app.use('/api/register', signController);
app.use('/api/game', gameController);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, function() {
  console.log('App listening on port 3000!');
});