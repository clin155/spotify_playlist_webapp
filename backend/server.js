const app = require('./gork.js')
const http = require('http')

var httpServer = http.createServer(app);


httpServer.listen(app.get('port'), function() {
  console.log("Express Server Running on port " + app.get('port'));
  console.log(`url: ${process.env.HOST_URL}`);
});


