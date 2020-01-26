const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.buffer = [];
  }

  _transform(chunk, encoding, callback) {
    const _separator = os.EOL;
    const _chunk = chunk.toString('utf-8');

    this.buffer.push(_chunk);

    if (_chunk.indexOf(_separator) === -1) {
      callback();
      return;
    }

    const bufferValue = [].concat(this.buffer).join('');
    const chunkList = bufferValue.split(_separator);

    while (chunkList.length > 1) {
      this.push(chunkList[0]);
      chunkList.shift();
    }

    this.buffer = chunkList;

    callback();
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      this.push([].concat(this.buffer).join(''));
    }

    callback();
  }
}

module.exports = LineSplitStream;
