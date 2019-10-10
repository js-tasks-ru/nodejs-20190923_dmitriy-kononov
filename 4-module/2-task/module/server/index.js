const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

const writeFile = require('./../writeFile');

const sendError = (code, msg, res) => {
  res.statusCode = code;
  res.end(msg);
};




server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

 

  switch (req.method) {
    case 'POST':
      writeFile(undefined, req);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
