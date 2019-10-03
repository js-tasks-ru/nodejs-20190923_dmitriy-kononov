const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    const { limit } = options;
    
    this._limit = limit;
    this._dataSize = 0;   
  }

  _transform(chunk, encoding, callback) {   
    this._dataSize += chunk.length;
    
    if (this._dataSize > this._limit)
      callback(new LimitExceededError());
    else    
      callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
