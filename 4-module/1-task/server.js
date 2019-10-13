const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const sendError = (code, msg, res) => {
  res.statusCode = code;
  res.end(msg);
};

const sendResponse = (pathname, res) => {
  pathname = path.normalize(pathname);

  if (path.dirname(pathname) !== '.' && path.dirname(pathname) !== path.sep) {
    sendError(400, 'do not use sub directories', res);
    return;
  }

  const filepath = path.join(__dirname, 'files', path.basename(pathname));

  const file = new fs.ReadStream(filepath);

  file.on('ready', () => {
    file.pipe(res);
  });

  file.on('error', (err) => {
    const {code} = err;

    if (code === 'ENOENT') {
      sendError('404', 'File not found', res);
      return;
    }

    sendError('500', 'Not implemented', res);
  });
};

server.on('request', (req, res) => {
  switch (req.method) {
    case 'GET':
      const pathname = url.parse(req.url).pathname.slice(1);  
      sendResponse(pathname, res);
      break;

    default:
      sendError(500, 'Not implemented', res);
  }
});

module.exports = server;
