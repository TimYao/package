/*
   Promise 实现

   1. Promise是一个类
   2. execute同步执行
   3. pending, resolve, reject 状态改变即不会再改变
   4. then 异步触发
   5. 调用resolve、reject改变状态  value/reason 返回值
*/

// 三种基本状态
const PENDING = 'pending';
const RESOLVED = 'fulfilled';
const REJECTED = 'rejected';

const resolvePromise = (promise2, x ,resolve, reject) => {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  /*
    若返回的值为对象或者函数即为promise对象，若为对象{then}
    对象有可能出现请求：
    obj = {then: 111/fn/throw error}
    x.then((v)=>{},(r)=>{})
  */
 let called;
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if(called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if(called) return;
          called = true;
          reject(r);
        })
      } else {
        resolve(x);
      }
    } catch(e) {
      if (called) return;
      called = true;
      // 说明then作为了getter属性并抛出了错误
      reject(e);
    }
  } else {
    resolve(x);
  }
}

class Promise {
  constructor(execute){
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.resolves = [];
    this.rejects = [];

    // expose resolve
    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.state === PENDING) {
        this.state = RESOLVED;
        this.value = value;
        this.resolves.length > 0 && execFun(this.resolves);
      }
    }
    // expose reject
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.rejects.length > 0 && execFun(this.rejects);
      }
    }
    // register callback
    function execFun (fns) {
      fns.forEach(fn => {
        fn();
      });
    }

    try {
      execute(resolve, reject);
    } catch(e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected){
    let promise2;

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : e => {throw e;}

    promise2 = new Promise((resolve, reject) => {
      if (this.state === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      }
      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject(e);
          }
        }, 0)
      }
      if (this.state === PENDING) {
        this.resolves.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch(e) {
              reject(e);
            }
          }, 0)
        })
        this.rejects.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch(e) {
              reject(e);
            }
          }, 0)
        })
      }
    })
    return promise2;
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;
