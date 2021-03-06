const http = require('http');
const cors = require('cors');
const MongoDBStore = require("connect-mongodb-session");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = require('./config')();
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mongoStore = MongoDBStore(sessions);

const corsOptions = {
  exposedHeaders: ["Access-Control-Expose-Headers", "Access-Control-Allow-Headers", 
  "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
  preflightContinue: true,
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
}

mongoose.connect(process.env.DATABASE_URL,
    {
      useNewUrlParser: true,
    }
  );
  
const db = mongoose.connection
db.on("error", error => console.log(error))
db.once("open", () => console.log("Connected to Mongo"))

const store = new mongoStore({
  collection: "userSessions",
  uri: process.env.DATABASE_URL,
  expires: 1000,
});
const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser());
app.use(
  sessions({
    name: "GORKIO",
    secret: "ihihbhfduqifhiquwhdfiquwh",
    store: store,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: true,
      maxAge: oneDay,
    },
    })
  );
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})

const loginRouter = require('./routes/login');
app.use('/login',loginRouter)

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express Server Running on port " + app.get('port'));
  console.log("url: http://localhost:" + app.get('port'));
});

