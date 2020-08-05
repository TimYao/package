const {getOptions} = require('loader-utils');
const {getType} = require('mime');
function loader(source) {
  // source读入格式为二进制
  const options = getOptions(this);
  let limit = options.limit || 16*1034;
  const fallback = options.fallback || './file-loader';
  const filename = options.filename || '[hash].[ext]';
  let mimeType = getType(this.resourcePath);
  // const content = Buffer.from(source);
  // console.log(this);
  if (limit) {
    limit = parseFloat(limit);
  }
  if (source.length < limit && limit) {
    const base64img = `data:${mimeType};base64,${source.toString('base64')}`;
    return `module.exports = ${JSON.stringify(base64img)}`;
  }
  const fileFallback = require(fallback);
  return fileFallback.call(this, source, {name: filename});
}

loader.raw = true;
module.exports = loader;