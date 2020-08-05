const Hook = require('./Hook');

class MyAsyncParallelHook extends Hook {
  constructor(arg) {
    super();
    const flg = this.validateArr(arg);
    if (!flg) {
      return;
    }
    this.args = arg;
    this.l = arg.length;
  }
  tapAsync(name, fn) {
    this.hooks = this.hooks || [];
    this.hooks.push(fn);
  }
  callAsync(...args) {
    let i = this.hooks.length;
    const callback = args.pop();
    let done = (err) => {
      if (i<0) {
        callback(err);
        return;
      }
      err && (callback(err));
    }
    this.hooks.forEach(fn => {
      fn.apply(null, [...args, (err)=>{
        i--;
        done(err);
      }]);
    });
  }
}

module.exports = MyAsyncParallelHook;