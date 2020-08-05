const babel = require("@babel/core");
function loader(source, inputSourceMap, data) {
  // console.log(source, inputSourceMap);
  // console.log('\n', this.request)
  const options = {
    presets: ['@babel/preset-env'],
    inputSourceMap: inputSourceMap,
    sourceMaps: true,
    filename: this.request.split("!")[1].split("/").pop(),
  };

  let { code, map, ast } = babel.transform(source, options);
  return this.callback(null, code, map, ast)
}

module.exports = loader;