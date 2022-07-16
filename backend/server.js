const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/spotifymanager',
  {
    useNewUrlParser: true,
  }
);

app.use(cors());
app.listen(3001, () => {
    console.log("Starting...")
});