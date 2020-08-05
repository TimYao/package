const util = require('../util');
const Promise = require('./promise');


// 实例方法
Promise.prototype.catch = function (fn) {
  return this.then(null, fn);
}
Promise.prototype.finally = function (fn) {
  return this.then((v) => {
    return Promise.resolve(fn()).then(() => v);
  }, (e) => {
    return Promise.resolve(fn()).then(() => { throw e; });
  })
}

// 静态方法
Promise.resolve = function (obj) {
  return new Promise((resolve) => {
    resolve(obj);
  })
}
Promise.reject = function (obj) {
  return new Promise((resolve, reject) => {
    reject(obj);
  })
}
Promise.all = function (promises) {
  if (!util.isArray(promises)) {
    throw '参数格式为数组，请传入正确的格式！';
  }
  return new Promise((resolve, reject) => {
    let index = 0;
    let result = [];
    const processData = (data, i) => {
      result[i] = data;
      if (++index === promises.length) {
        resolve(result);
      }
    }
    promises.forEach((promise, i) => {
      if (util.isPromise(promise)) {
        promise.then((data) => {
          processData(data, i);
        }, reject)
      } else {
        processData(promise, i);
      }
    });
  })
}
Promise.race = function (promises) {
  if (!util.isArray(promises)) {
    throw '参数格式为数组，请传入正确的格式！';
  }
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      if (util.isPromise(promise)) {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    })
  })
}

// 自行扩展阻断方法
Promise.wrap = function (promise) {
  let abort;
  let p1 = new Promise((resolve, reject) => {
    abort = reject;
  })
  let p = Promise.race([promise, p1]);
  p.abort = abort;
  return p;
}
/*
  使用demo:
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success');
    }, 2000);
  })
  let p = Promise.wrap(p1);
  p.then((d) => {
    console.log(d);
  }).catch((e) => {
    console.log(e);
  })
  setTimeout(() => {
    p.abort('阻断');
  }, 1000)
*/


module.exports = Promise;