const Hook = require('./Hook');

class MySyncWaterfallHook extends Hook {
  constructor(arg) {
    super();
    const flg = this.validateArr(arg);
    if (!flg) {
      return;
    }
    this.args = arg;
    this.l = arg.length;
  }
  tap(name, fn) {
    this.hooks = this.hooks || [];
    this.hooks.push(fn);
  }
  call(...arg) {
    if (this.hooks) {
      let value;
      let k;
      for (let i=0; i<this.hooks.length;i++) {
        let fn = this.hooks[i];
        if (value !== undefined) {
          if (k === undefined) {
            arg = this.getArg(arg, i);
          }
          arg = [value, ...arg];
        }
        value = fn.apply(null, arg);
      }
    }
  }
  getArg(args, currentIndex) {
    const l = args.length;
    let arg;
    if (l>=currentIndex) {
      arg = args.slice(1);
    }
    !Array.isArray(arg) && (arg = [arg])
    return arg;
  }
}
module.exports = MySyncWaterfallHook;