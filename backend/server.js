const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = require('./config')();

app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.render('index');
})

const loginRouter = require('./routes/login')
app.use('/login',loginRouter)

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express Server Running on port " + app.get('port'));
  console.log("url: http://localhost:" + app.get('port'));
});

