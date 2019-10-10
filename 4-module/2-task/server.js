const url = require('url');
const http = require('http');

const InternalServerError = require('./module/Message/InternalServerError');

const server = new http.Server();
const writeFile = require('./module/writeFile');

const sendError = (res, code, msg) => {
  res.statusCode = code;
  res.end(msg);
};

server.on('request', (req, res) => {
  const _sendError = sendError.bind(null, res);

  const pathname = url.parse(req.url).pathname.slice(1);

  switch (req.method) {
    case 'POST':
      writeFile(pathname, req, (msg) => {
        _sendError(msg.code, msg.message);
      });
      break;

    default:
      const err = new InternalServerError();
      _sendError(err.code, err.msg);
  }
});

module.exports = server;
