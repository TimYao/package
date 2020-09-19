import commanders from '../config/commander';

let resolveModule = (moduleContent) => {
  const module = require(moduleContent);
  return module.default ? module.default : module;
}

let isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
}

let isEmptyObject = (obj) => {
  return isObject(obj) && !Object.keys(obj).length
}

let checkCommander = (action, commanderName) => {
  let actionCommander = commanders[action];
  return actionCommander.some(name => name === commanderName)
}

let error = (err) => {
  const e = new Error(err || '错误');
  console.error(e.message || e);
}

export {
  resolveModule,
  isEmptyObject,
  checkCommander,
  error
}
