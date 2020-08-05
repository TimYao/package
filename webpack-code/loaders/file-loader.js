const {getOptions,interpolateName} = require('loader-utils');
function loader(source) {
  const options = getOptions(this);
  // 输出路径
  const outputPath = options.outputPath || '';
  // 文件名
  const filename = `${outputPath}/${options.name}`||'images/[hash].[ext]';
  const url = interpolateName(this, filename, {content: source});

  console.log('=========得到的图片地址', url);
  // 发射插入文件
  this.emitFile(url, source);
  return `module.exports = ${JSON.stringify(url)}`;
}

// 标识为二进制格式
loader.raw = true;
module.exports = loader;