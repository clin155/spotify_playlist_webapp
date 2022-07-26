'use strict';
const serverless = require('serverless-http');
const app = require('gork.js');

const handler = serverless(app);
module.exports.hello = async (event, context) => {
    const result = await handler(event, context);
    
    return result;

  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

