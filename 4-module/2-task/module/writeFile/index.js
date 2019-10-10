const fs = require('fs');
const path = require('path');

const writeFile = (url = 'test.txt', dataStream) => {
  const filePath = path.join(__dirname, '../../files', path.basename(url));

  const file = new fs.WriteStream(filePath);

  file.on('ready', () => {
    console.log('----ready----');
    dataStream.pipe(file);
  });

  file.on('error', (err) => {
    console.log('----ERROR-----');
    console.dir(err);
  });
};

module.exports = writeFile;
