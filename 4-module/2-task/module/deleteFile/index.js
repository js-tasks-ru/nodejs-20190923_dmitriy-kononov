const fs = require('fs');

const deleteFile = (path, cb) => {
  fs.unlink(path, (err) => {  
    if (err) {
      console.log('AAAAAAAAAAAAAAAAA');
      console.dir(err);
    }
    cb();
  });
};

module.exports = deleteFile;