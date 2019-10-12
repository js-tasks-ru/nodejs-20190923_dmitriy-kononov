const url = require('url');
const http = require('http');
const path = require('path');

const InternalServerError = require('./module/Message/InternalServerError');
const BadRequestError = require('./module/Message/BadRequestError');

const server = new http.Server();
const writeFile = require('./module/writeFile');
const deleteFile = require('./module/deleteFile');

const sendError = (res, code, msg) => {
  res.statusCode = code;
  res.end(msg);
};

server.on('request', (req, res) => {
  const _sendError = sendError.bind(null, res);

  switch (req.method) {
    case 'POST':

      const reqUrl = url.parse(req.url).pathname.slice(1);
      const pathname = path.normalize(reqUrl);

      if (path.dirname(pathname) !== '.' && path.dirname(pathname) !== path.sep) {
        const err = new BadRequestError();
        _sendError(err.code, err.msg);
        break;
      }

      const filePath = path.join(__dirname, './files', path.basename(reqUrl));

      writeFile(filePath, req, (msg) => {
        _sendError(msg.code, msg.message);
      });

      break;

    default:
      const err = new InternalServerError();
      _sendError(err.code, err.msg);
  }
});

module.exports = server;
