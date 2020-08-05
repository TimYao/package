function loader(source) {
  console.log('babel-b load');
  return source;
}
loader.pitch = function (remainingRequest, previousRequest, data) {
  console.log(remainingRequest);
  console.log(previousRequest);
  console.log('babel-b pitch');
  // return `${JSON.stringify('babel-b finished')}`;
}
module.exports = loader;