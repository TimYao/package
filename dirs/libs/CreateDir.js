/*
  创建目录：
    分析可采用同步，异步串行方式实现

    mkSyncDir 同步模式创建
    mkAsyncDir 异步模式创建
*/
const fs = require('fs');
class CreateDir {
  constructor(path, mode, cb = () => {}){
    this.asset(path);
    this.mode = mode;
    this.cb = cb;
    this.path = this.handlerPath(path);

    // 此方法运用了适配器设计方法，完成调用接口的统一
    this.add();
  }
  handlerPath(path) {
    path = path.split('/');
    return path;
  }
  add() {
    if(this.mode === 'sync') {
      this.mkSyncDir();
    } else if(this.mode === 'async') {
      this.mkAsyncDir();
    }
  }
  mkSyncDir() {
    let index = 0;
    this.path.forEach((path, i) => {
      const current = this.path.slice(0, i+1).join('/');
      try {
        fs.accessSync(current)
      }catch(e) {
        fs.mkdirSync(current);
        ++index;
      }
    });
    if (index === this.path.length) {
      this.cb && this.cb();
    }
  }
  mkAsyncDir() {
    let index = 0;
    const next = (err) => {
      if (err) return this.cb(err);
      if (index === this.path.length) {
        return this.cb();
      }
      const current = this.path.slice(0, ++index).join('/');
      fs.access(current, (err) => {
        if (err) {
          fs.mkdir(current, next);
        } else {
          this.cb(new Error('创建文件已经存在!'));
        }
      })
    }
    next();
  }
  asset(condition, message = '参数错误') {
    console.assert(typeof condition === 'string', message);
  }
}

module.exports = CreateDir;