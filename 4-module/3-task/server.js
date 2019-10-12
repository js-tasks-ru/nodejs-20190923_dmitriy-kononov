const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const deleteFile = async (pathname) => {
  return await fs.promises.unlink(pathname);
};

const checkFile = async (pathname) => {
  await fs.promises.stat(pathname);
};

const checkPath = (url) => {
  const pathname = path.normalize(url);

  if (path.dirname(pathname) !== '.' && path.dirname(pathname) !== path.sep) {
    return false;
  }

  return true;
};

const sendMsg = (res, code, msg) => {
  res.statusCode = code;
  res.end(msg);
};

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  switch (req.method) {
    case 'DELETE':

      const sendRes = sendMsg.bind(null, res);

      if (!checkPath(pathname)) {
        sendRes(400, '400');
        break;
      }

      const filepath = path.join(__dirname, 'files', pathname);

      checkFile(filepath)
          .then(() => {
            deleteFile(filepath)
                .then(() => {
                  sendRes(200, '200');
                })
                .catch(() => {
                  sendRes(500, '500');
                });
          })
          .catch((err) => {
            if (err.code === 'ENOENT') {
              sendRes(404, '404');
              return;
            }

            sendRes(500, '500');
          });

      break;

    default:
      sendRes(500, '501');
  }
});

module.exports = server;
