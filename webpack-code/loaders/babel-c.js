function loader(source) {
  console.log('babel-c load');
  return source;
}
loader.pitch = function (remainingRequest, previousRequest, data) {
  console.log('babel-c pitch');
}
module.exports = loader;