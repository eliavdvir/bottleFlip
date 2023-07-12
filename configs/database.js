const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
  });