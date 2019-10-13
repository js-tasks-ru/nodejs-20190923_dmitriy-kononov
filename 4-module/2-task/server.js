const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

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

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const sendReq = sendMsg.bind(null, res);

      server.once('clientError', () => {
        deleteFile(filepath)
            .then(() => {
              sendReq(501, '501');
            })
            .catch(() => {
              sendReq(501, '501');
            });
      });

      if (!checkPath(pathname)) {
        sendReq(400, '400');
        break;
      }

      checkFile(filepath)
          .then(() => {
            sendReq(409, '409');
          })
          .catch((err) => {
            if (err.code !== 'ENOENT') {
              sendReq(501, '501');
              return;
            }

            const file = fs.createWriteStream(filepath);
            const limitSizeStream = new LimitSizeStream({limit: 1048576});

            req.pipe(limitSizeStream).pipe(file);

            file.on('finish', () => {
              sendReq(201, '201');
            });

            file.on('error', () => {
              sendReq(501, '501');
            });

            limitSizeStream.on('error', () => {
              deleteFile(filepath)
                  .then(() => {
                    sendReq(413, '413');
                  })
                  .catch(() => {
                    sendReq(501, '501');
                  });
            });
          });
      break;

    default:
      sendReq(501, '501');
  }
});

module.exports = server;
