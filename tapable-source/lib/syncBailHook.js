const Hook = require('./Hook');

class MySyncBailHook extends Hook {
  constructor(arg) {
    super();
    const flg = this.validateArr(arg);
    if (!flg) {
      return;
    }
    this.args = arg;
  }
  tap(name, fn) {
    this.hooks = this.hooks || [];
    this.hooks.push(fn);
  }
  call(...arg) {
    if (this.hooks) {
      for (let i=0; i<this.hooks.length;i++) {
        let fn = this.hooks[i];
        const value = fn.apply(null, arg);
        if (value) {
          break;
        }
      }
    }
  }
}
module.exports = MySyncBailHook;