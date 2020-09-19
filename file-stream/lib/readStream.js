const {EventEmitter} = require('events');
const fs = require('fs');

class ReadStream extends EventEmitter {
  constructor(path, options) {
    super();
    if (!path) throw 'path is not empty';
    this.autoClose = options.autoClose || true;
    this.highWaterMark = options.highWaterMark || 64*1024;
    this.mode = options.mode || 0o666;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || 'utf8';
    this.flowing = false;
    this.path = path;
    this.start = options.start || 0;
    this.tail = options.end;
    this.pos = this.start;
    this.buffer = Buffer.alloc(this.highWaterMark);

    // 利用此方法来开启流读取
    this.on('newListener', (type, listener) => {
      if (type === 'data') {
        this.flowing = true;
        this.read();
      }
    })
    this.on('end', () => {
      if (this.autoClose) {
        this.destroy();
      }
    })
    this.open();
  }
  open () {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) return this.emit('error', err);
      this.fd = fd;
      this.emit('open');
    })
  }
  end () {
    if (this.autoClose) {
      this.destroy();
    }
  }
  read () {
    if (typeof this.fd != 'number') {
      return this.once('open', () => this.read());
    }
    const n = this.tail ? Math.min(this.tail - this.pos, this.highWaterMark) : this.highWaterMark;
    fs.read(this.fd, this.buffer, 0, n, this.pos, (err, bytesRead) => {
      if (err) return;
      if (bytesRead) {
        let data = this.buffer.slice(0, bytesRead);
        data = this.encoding ? data.toString(this.encoding) : data;
        data && this.emit('data', data)
        this.pos += bytesRead;
        if (this.tail && this.pos >= this.tail) {
          this.emit('end');
        }
        if (this.flowing) this.read();
      }
    });
  }
  destroy () {
    fs.close(this.fd, () => {
      this.emit('close');
    })
  }
  pause () {
    this.flowing = false;
  }
  resume() {
    this.flowing = true;
    this.read();
  }
  pipe (ws, cb) {
    // this is writeable pipe object
    if (!ws) throw 'param is at fault';
    this.on('data', (data) => {
      const flg = ws.write(data);
      if (!flg) {
        this.pause();
      }
    })
    ws.on('drain', () => {
      this.resume();
    })
    this.on('end', () => {
      ws.end();
      cb && cb()
    })
  }
}

module.exports = function (path, options) {
  return new ReadStream(path, options);
}