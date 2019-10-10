const fs = require('fs');
const path = require('path');

const LimitSizeStream = require('./../LimitSizeStream');

const BadRequestError = require('../Message/BadRequestError');
const LimitExceededError = require('../Message/LimitExceededError');
const OkMessage = require('../Message/OkMessage');
const FileExistsError = require('./../Message/FileExistsError');
const InternalServerError = require('./../Message/InternalServerError');

const writeFile = (url = 'test.txt', dataStream, cb) => {
  
  pathname = path.normalize(url);

  if (path.dirname(pathname) !== '.' && path.dirname(pathname) !== path.sep) {   
    cb(new BadRequestError);
    return;
  }
  
  const filePath = path.join(__dirname, '../../files', path.basename(url));

  fs.stat(filePath, (err, stat) => {
    if (err === null) {
      cb(new FileExistsError);
      return;
    }

    if (err.code !== 'ENOENT') {
      cb(new InternalServerError);
      return;
    }

    const file = new fs.WriteStream(filePath);
    const limitStream = new LimitSizeStream({limit: 1048576});

    file.on('ready', () => {
      dataStream.pipe(limitStream).pipe(file);
      
      limitStream.on('end', () => {
        cb(new OkMessage());
      });

      limitStream.on('error', () => {
        cb(new LimitExceededError);
      });

    });

    file.on('error', (err) => {
      console.dir(err);
    });
  });  
};

module.exports = writeFile;
