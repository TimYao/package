const defaults = require('./default');
// let excludeKey = ['pkgName', 'address', 'port'];
let config;

const handlerConfig = (reqConfig) => {
  const options = {};
  for(let key in reqConfig){
    if (reqConfig[key] === 'true') {
      reqConfig[key] = true;
    }
    if (reqConfig[key] === 'false') {
      reqConfig[key] = false;
    }
    options[key] = reqConfig[key];
  }
  return options;
}

const mergeOptions = (reqConfig) => {
  const options = handlerConfig(reqConfig);
  config = Object.assign({}, options);
}
const getConfig = () => {
  return config || defaults;
}


module.exports = {
  mergeOptions,
  getConfig
};