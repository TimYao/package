const {stringifyRequest} = require('loader-utils');
function loader(source) {
  // source = source.replace(/\\n*/g, ``);
  // console.log('=====', source);
  // return `
  //   const style = document.createElement('style');
  //   style.innerText = ${JSON.stringify(source)};
  //   document.body.appendChild(style);
  //   module.exports = '';
  // `;
}
loader.pitch = function (remainingRequest, previousRequest, data) {
  // 针对多级loader处理状态下，通过pitch劫持，改变为模块导出方式加载入内容
  // console.log(stringifyRequest(this, remainingRequest));
  return `
    const style = document.createElement('style');
    style.innerText = require(${stringifyRequest(this, '!!'+ remainingRequest)});
    document.body.appendChild(style);
    module.exports = '';
  `;
}
module.exports = loader;