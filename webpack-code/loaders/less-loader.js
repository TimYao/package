const less = require('less');

function loader(source) {
  const callback = this.async();
  less.render(source, {sourceMap: {}}, (err, result) => {
    return callback(err, `module.exports=${JSON.stringify(result.css)}`);
  });
}
module.exports = loader;