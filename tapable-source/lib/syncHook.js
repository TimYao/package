const Hook = require('./Hook');

class SyncHook extends Hook {
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
      this.hooks.forEach(fn => {
        fn.apply(null, arg)
      });
    }
  }
}
module.exports = SyncHook;