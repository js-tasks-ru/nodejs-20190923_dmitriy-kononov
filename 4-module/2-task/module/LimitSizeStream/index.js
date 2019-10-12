const stream = require('stream');
const {EOL} = require('os');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._encoding = (options && options.encoding) ? options.encoding : 'utf8';
    this._buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this._buffer += chunk.toString(this._encoding);
    callback();
  }

  _flush(callback) {
    const arr = this._buffer.split(EOL);

    arr.forEach((el) => this.push(el));
    callback();
  }
}

module.exports = LimitSizeStream;
