/*
  删除目录
    分析：同步，异步串行（深度）一个删除完通知下一个删除开始，异步并行（广度）

    目录删除规则为，从叶子节点开始，最后删除根节点
*/

const fs = require('fs');
const path = require('path');

class DeleteDir {
  constructor(path, mode = 'sync', type, cb= () => {}) {
    this.asset(path);
    this.path = path;
    this.mode = mode;
    this.cb = cb;

    if (this.mode) {
      if (typeof type === 'function') {
        this.cb = type;
        type = null;
      }
      this.type = type || 'serial';
    }

    // 适配设计模式
    this.remove();
  }
  remove() {
    if (this.mode === 'sync') {
      this.delSyncDir();
    } else if (this.mode === 'async') {
      if (this.type === 'serial') {
        this.delAsyncSerialDir();
      } else if (this.type === 'parallel') {
        this.delAsyncParallelDir();
      }

    }
  }
  delSyncDir() {
    const dir = this.path;
    const del = (dir, cb) => {
      try {
        const stat = fs.statSync(dir);
        if(stat.isDirectory()) {
          const dirs = fs.readdirSync(dir);
          dirs.forEach((d) => {
            del(path.join(dir, d));
          })
          fs.rmdirSync(dir);
          cb && cb();
        } else {
          fs.unlinkSync(dir);
          cb && cb();
        }
      }catch(e) {
        cb && cb(e);
      }
    }
    del(dir, this.cb);
  }
  delAsyncSerialDir() {
    const dir = this.path;
    const del = (dir, cb) => {
      fs.stat(dir, (err, stat) => {
        if (err) return cb(err);
        if (stat.isDirectory()) {
          fs.readdir(dir, (err, dirs) => {
            if (err) return this.cb(err);
            let index = 0;
            const next = () => {
              if (index === dirs.length) {
                return fs.rmdir(dir, cb);
              }
              const current = dirs[index++];
              del(path.join(dir, current), next);
            }
            next();
          })
        } else {
          fs.unlink(dir, cb);
        }
      })
    }
    del(dir, this.cb);
  }
  delAsyncParallelDir() {
    const dir = this.path;
    const del = (dir, cb) => {
      fs.stat(dir, (err, stat) => {
        if (err) return cb(err);
        if (stat.isDirectory()) {
          fs.readdir(dir, (err, dirs) => {
            if (err) return cb(err);
            if (dirs.length === 0) {
              return fs.rmdir(dir, cb);
            }
            dirs = dirs.map((d) => path.join(dir, d));
            let index = 0;
            const done = () => {
              if (++index === dirs.length) {
                fs.rmdir(dir, cb)
              }
            }
            dirs.forEach((dir) => {
              del(dir, done);
            })
          })
        } else {
          fs.unlink(dir, cb);
        }
      })
    }
    del(dir, this.cb);
  }
  asset(condition, message = '参数错误') {
    console.assert(typeof condition === 'string', message);
  }
}

module.exports = DeleteDir;