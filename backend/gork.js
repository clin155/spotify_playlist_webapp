const cors = require('cors');
const bodyParser = require('body-parser');
const app = require('./config')();
const cookieParser = require("cookie-parser");
const express = require('express');
const mongoose = require('mongoose');
const sessions = require('express-session');
const winston = require('winston');
const expressWinston = require('express-winston');
const MongoStore = require('connect-mongo');

const corsOptions = {
  exposedHeaders: ["Access-Control-Expose-Headers", "Access-Control-Allow-Headers", 
  "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", 
  "Set-Cookie"],
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
}
try {
  const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
  mongoose.connect(process.env.DATABASE_URL,
    connectionParams
  );
  const db = mongoose.connection
  db.on("error", error => console.log(error))
  db.once("open", () => console.log("Connected to Mongo"))
  
} catch (e) {
  console.log(e)
}


app.use(cookieParser());
// const store = new MongoDBStore({
//     uri: process.env.DATABASE_URL,
//     collection: 'userSessions',
//     expires: 1000
// });

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  secret: "z62daKsIlqoweiope",
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    collectionName: 'userSessions',
    ttl: 14 * 24 * 60 * 60, // = 1 days. Default
    autoRemove: 'native' // Default
  }),
  cookie: {
    secure: (process.env.NODE_ENV !== "development"),
    maxAge: oneDay,
    httpOnly: true,
    sameSite: (process.env.NODE_ENV !== "development" ? 'none' : 'lax')
  },
}));
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.url}}, {{res.statusCode}} ", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index');
})

const loginRouter = require('./routes/login');
app.use('/api/login/',loginRouter);

const apiRouter = require('./routes/api');
app.use('/api/', apiRouter);

const userrRouter = require('./routes/user');
app.use('/api/user/',userrRouter);

const playlistRouter = require('./routes/playlists');
app.use('/api/playlist/',playlistRouter);

const songBankRouter = require('./routes/songbank');
app.use('/api/bank/', songBankRouter);

const trackRouter = require('./routes/track');
app.use('/api/track/', trackRouter);

module.exports = app;

