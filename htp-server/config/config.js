let excludeKey = ['pkgName', 'address', 'port'];
let config = {};

const handlerConfig = (reqConfig) => {
  const options = {};
  for(let key in reqConfig){
    if(!excludeKey.includes(key)){
      options[key] = reqConfig[key];
    }
  }
  return options;
}

const mergeOptions = (reqConfig) => {
  const options = handlerConfig(reqConfig);
  config = Object.assign({}, config, options);
}
const getConfig = () => {
  return config;
}

module.exports = {
  mergeOptions,
  getConfig
};