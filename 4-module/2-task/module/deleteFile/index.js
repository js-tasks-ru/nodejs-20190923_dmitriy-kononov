const fs = require('fs');

const deleteFile = (path) => {
fs.unlink(path, (err) => {
        console.dir(err);
1});
};

module.exports = deleteFile;