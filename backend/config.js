const express = require('express');

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

module.exports = function() {

  var app = express();
  app.set('port', process.env.PORT || 3000);
  return app;
};