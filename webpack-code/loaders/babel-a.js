function loader(source) {
  console.log('babel-a load');
  // console.log('========', this.value, '\n', this.inputValue);
  return source;
}
loader.pitch = function (remainingRequest, previousRequest, data) {
  console.log('babel-a pitch');
}
loader.raw = true;
module.exports = loader;