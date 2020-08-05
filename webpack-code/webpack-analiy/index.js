/*
  1. 完成挂载属性方法到webpack函数上，例如各种插件;通过object.defineProperty
  2. 通过函数嵌套完成，缓存记忆执行，以及参数接受

  3. 完成webpack传入参数的校验
     利用包schema-utils 完成校验

  4. 对options 合并
     manually config
     default config
     command config

     context = config.context || process.cwd()
*/

const webpack = require('webpack');
const options = require('./webpack.config');
const compiler = webpack(options);

compiler.run((err,stats)=>{
   console.log(err);
   let json = stats.toJson({
       entries:true,//显示入口
       chunks:true,//显示打包出来的代码块
       modules:true,//以数组方式模块
       _modules:true,//以对象的方式放置模块
       assets:true//产出的文件或者资源
   });
   console.log(JSON.stringify(json,null,2));
});



// const AsyncSeriesHook = require('tapable').AsyncSeriesHook;
// const asyncSeriesHook= new AsyncSeriesHook(['compiler']);
// asyncSeriesHook.callAsync('s', (err)=>{
//    console.log(11);
// })
// const path = require('path');
// console.log(path.posix.join(process.cwd(),'./src/index.js'));

// const interable = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
// interable[Symbol.iterator] = function*() {
//     let index = 0;
//    //  return { // 遍历器对象
//    //      next: () => {
//    //          return { value: this[index], done: index++ == this.length }
//    //      }
//    //  }
//    while(index < this.length){
//       yield this[index++];
//    }
// }
// // console.log([...interable]);
// for(let a in interable){
//    console.log(a);
// }

// const path = require('path');
// console.log(path.resolve('views'));

