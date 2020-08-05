const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
const MySyncHook = require('./lib/syncHook');
const MySyncBailHook = require('./lib/syncBailHook');
const MySyncWaterfallHook= require('./lib/syncWaterfallHook');
const MyAsyncParallelHook= require('./lib/asyncParallelHook');



const syncHook = new SyncHook(['name']);
const mySyncHook = new MySyncHook(['name']);

const syncBailHook = new SyncBailHook(['name']);
const mySyncBailHook = new MySyncBailHook(['name']);

const syncWaterfallHook = new SyncWaterfallHook(['name', 'text']);
const mySyncWaterfallHook = new MySyncWaterfallHook(['name', 'text']);

const asyncParallelHook = new AsyncParallelHook(['name']);
const myAsyncParallelHook = new MyAsyncParallelHook(['name', 'text']);

// SyncHook
// mySyncHook.tap('1', (name) => {
//   console.log('1:', name);
// })
// mySyncHook.tap('2', (name) => {
//   console.log('2:', name);
// })
// mySyncHook.call('test');


// SyncBailHook
// mySyncBailHook.tap('1', (name) => {
//   console.log('1:', name);
//   return 'finished 1';
// })
// mySyncBailHook.tap('2', (name) => {
//   console.log('2:', name);
//   return 'finished 2';
// })
// mySyncBailHook.tap('3', (name) => {
//   console.log('3:', name);
// })
// mySyncBailHook.call('test');


// SyncWaterfallHook
// mySyncWaterfallHook.tap('1', (name, arg) => {
//   console.log('1:', name, arg);
//   //return 'from 1';
// })
// mySyncWaterfallHook.tap('2', (name, arg) => {
//   console.log('2:', name, arg);
//   //return 'from 2';
// })
// mySyncWaterfallHook.tap('3', (name, arg) => {
//   console.log('3:', name, arg);
// })
// mySyncWaterfallHook.call('test', 'text');


// console.time("cost");
// myAsyncParallelHook.tapAsync('1', (name, callback) => {
//   setTimeout(function () {
//     console.log(1, name);
//     callback();
//   }, 1000);
// })
// myAsyncParallelHook.tapAsync('2', (name, callback) => {
//   setTimeout(function () {
//     console.log(2,name);
//     callback('e');
//   }, 2000);
// })
// myAsyncParallelHook.tapAsync('3', (name, callback) => {
//   setTimeout(function () {
//     console.log(3, name);
//     callback();
//   }, 3000);
// })
// myAsyncParallelHook.callAsync("test", (err) => {
//   console.log('err:', err);
//   console.timeEnd("cost");
// });


// let { AsyncParallelHook } = require("tapable");
// let queue = new AsyncParallelHook(["name", "txt"]);
// console.time("cost");
// queue.tapAsync("1", function (name, txt,callback) {
//   setTimeout(function () {
//     console.log(1, name, txt);
//     callback();
//   }, 1000);
// });
// queue.tapAsync("2", function (name, txt, callback) {
//   setTimeout(function () {
//     console.log(2, name, txt);
//     callback('e');
//   }, 2000);
// });
// queue.tapAsync("3", function (name, txt, callback) {
//   setTimeout(function () {
//     console.log(3, name, txt);
//     callback();
//   }, 3000);
// });
// queue.callAsync("zfpx", 'test', (err) => {
//   console.log(err);
//   console.timeEnd("cost");
// });








