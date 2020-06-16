const isPromise = (promise) => {
  return promise != null && typeof promise.then === 'function';
}
const isArray = (obj) => {
  return Array.isArray(obj);
}

exports.isPromise = isPromise;
exports.isArray = isArray;