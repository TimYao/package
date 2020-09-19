const {EventEmitter} = require('events');
const fs = require('fs');

class WriteStream extends EventEmitter {
  constructor (path, options) {
    super();
    if (!path) throw 'path is not empty';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.mode = options.mode || 0o666;
    this.flags = options.flags || 'w';
    this.path = path;
    this.length = 0;
    this.buffers = [];
    this.writing = false;
    this.autoClose = options.autoClose || true;

    this.open();
  }
  open () {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) return this.emit('error');
      this.fd = fd;
      this.emit('open');
    })
  }
  write (chunk, encoding, cb) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, this.encoding);
    this.length += chunk.length;
    const flg = this.length < this.highWaterMark ? true : false;

    if (this.writing) {
      this.buffers.push({
        chunk,
        encoding,
        cb
      });
    } else {
      this._write(chunk, encoding, this.clearBuffer.bind(this));
      this.writing = true;
    }
    return flg;
  }
  _write (chunk, encoding, cb) {
    if (typeof this.fd !== 'number') return this.once('open', () => this._write(chunk, encoding, cb));
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      if (err) {
        this.emit('error', err);
        if (this.autoClose) {
          this.destroy();
        }
      }
      this.length -= written;
      this.pos += written;
      cb && cb();
    })
  }
  clearBuffer () {
    const data = this.buffers.pop();
    if (data) {
      this._write(data.chunk, data.encoding, this.clearBuffer.bind(this));
    } else {
      this.emit('drain');
      this.writing = false;
    }
  }
  end () {
    if (this.autoClose) {
      this.emit('end');
      this.destroy();
    }
  }
  destroy () {
    fs.close(this.fd, () => {
      this.emit('close');
    })
  }
}

module.exports = function (path, options) {
  return new WriteStream(path, options);
}