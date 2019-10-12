const fs = require('fs');

const deleteFile = (path, cb) => {
  fs.unlink(path, (err) => {  
    if (cb) cb();
  });
};

module.exports = deleteFile;