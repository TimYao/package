const checkArg = (arg) => {
  let flg = true;
  if(!Array.isArray(arg)) {
    console.log('params must be array');
    flg = false;
    return;
  }

  let l = arg.length;
  for (let i=0; i<l; i++) {
    if (typeof arg[i] !== 'string') {
      flg = false;
      break;
    }
  }
  if (flg === false) {
    console.log('params is error');
  }
  return flg;
}
class Hook {
  constructor() {
  }
  validateArr(arg) {
    return checkArg(arg);
  }
}

module.exports = Hook;