const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = require('./config')();
const cookieParser = require("cookie-parser");
const express = require('express');
const mongoose = require('mongoose');
const sessions = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(sessions);

const corsOptions = {
  exposedHeaders: ["Access-Control-Expose-Headers", "Access-Control-Allow-Headers", 
  "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", 
  "Set-Cookie"],
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

app.use(cookieParser());
const store = new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'userSessions',
    expires: 1000
});
  
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    store: store,
    cookie: { maxAge: oneDay },
    resave: false 
    })
);
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

