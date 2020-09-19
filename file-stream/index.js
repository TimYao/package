const Stream = require('./lib/index');
const writeStream = require('./lib/writeStream');
const readStream = Stream.ReadStream;
const rs = readStream('./files/1.txt', {highWaterMark: 3, mode: 0o666, flags: 'r', start: 0, end: 9});
const ws = writeStream('./files/2.txt', {highWaterMark: 3, mode: 0o666, flags: 'w'});

// 封装完成
rs.pipe(ws, () => {
  console.log('write finished');
});


// restart readable pipe
// const startRead = () => {
//   setTimeout(() => {
//     rs.resume();
//   }, 1000)
// };

/* test readable pipe
rs.on('open', () => {
  console.log('open');
});

rs.on('data', (data) => {
  console.log('data:', data);
  rs.pause();
  startRead();
})

rs.on('end', () => {
  console.log('end');
})

rs.on('close', () => {
  console.log('close');
})

rs.on('error', (err) => {
  console.log('error:', err);
});
*/

