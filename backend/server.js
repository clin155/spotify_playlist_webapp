const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = require('./config')();
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));


mongoose.connect(process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection
db.on("error", error => console.log(error))
db.once("open", () => console.log("Connected to Mongo"))

app.get('/', (req, res) => {
  res.render('index');
})

const loginRouter = require('./routes/login');
const exp = require('constants');
app.use('/login',loginRouter)

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express Server Running on port " + app.get('port'));
  console.log("url: http://localhost:" + app.get('port'));
});

