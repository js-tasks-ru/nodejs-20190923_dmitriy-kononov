const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    const { encoding } = options;
    
    super(options);

    this._encoding = encoding;
    this._buffer = '';
  }

  _transform(chunk, encoding, callback) {
    console.log('---tr---');
    this._buffer += chunk.toString(this._encoding);

    console.log(`buffer = ${this._buffer}`)
    callback();
  }

  _flush(callback) {
    

    this._buffer.split(os.EOL).forEach((str) => {
      console.log('---fl----');
      console.log(`str = ${str}`);
      callback(null, str);
    });

  }
}

module.exports = LineSplitStream;
