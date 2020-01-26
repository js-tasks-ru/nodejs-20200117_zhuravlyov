const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.bytesTransferred = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytesTransferred += chunk.length;

    if (this.bytesTransferred <= this.limit) {
      this.push(chunk.toString('utf-8'));
      callback();
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
