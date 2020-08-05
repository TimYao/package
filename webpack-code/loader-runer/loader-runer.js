/*
  完成webpack中loader的处理
  1. 整合options参数
    对于loader的类型分类整合
      (1) 请求资源中的行内loader
      (2) 行内拿到处理资源文件
      (3) 通过资源后缀匹配loader配置列表，得到postLoader,normalLoader,preLoader
      (4) 根据资源前置标识，合并到指定的loader分类中
      (5) 整合好的loader,通过开启loaderRunner进行（pitch,loader处理）
  2. pitchLoading
  3. read entry
  4. loading


*/

const path = require('path');
const fs = require('fs');
const { Buffer } = require('buffer');

// 创建loader对象
const createLoaders = (loader) => {
  const loaderObject = {data:{}};
  loaderObject.request = loader;
  loaderObject.normal = require(loader);
  loaderObject.pitch = loaderObject.normal.pitch;
  return loaderObject;
}

function loaderRunner(options, callback) {
  let {entry, loaders} = options;
  let resource = path.resolve(__dirname, entry);
  let isSync = true;
  const loaderContext = {};
  loaderContext.loaderIndex = 0;

  // 为每一个loader创建一个整合对象
  loaders = loaders.map(createLoaders);

  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaders.map((loader) => loader.request).slice(loaderContext.loaderIndex+1).join('!');
    }
  })

  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaders.map((loader) => loader.request).slice(0, loaderContext.loaderIndex).join('!');
    }
  })

  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaders.map((loader) => loader.request).slice(loaderContext.loaderIndex).join('!');
    }
  })

  const innerCallback = (loaderContext.callback = function (err, args) {
    loaderContext.loaderIndex--;
    loaderNormal(args);
  });
  loaderContext.async = function() {
    isSync = false;
    return innerCallback;
  }

  const loaderNormal = (...args) => {
    if (loaderContext.loaderIndex < 0) {
      if(Array.isArray(args)){
        args = args[0];
      }
      return callback(null, args);
    }
    let loader = loaders[loaderContext.loaderIndex];
    let normal = loader.normal;
    let arg = normal.apply(loaderContext, args);
    if (!Array.isArray(arg)) {
      arg = [arg];
    }
    // 根据raw标识内容为什么类型，字符串还是二进制
    if (!normal.raw) {
      arg[0] = arg[0].toString();
    } else {
      arg[0] = Buffer.from(arg[0]);
    }

    loaderContext.loaderIndex--;
    loaderNormal.apply(loaderContext, arg);
  };

  // 读取entry文件
  const readEntryFile = () => {
    resource = fs.readFileSync(resource);
    return resource;
  }

  // 启动加载pitch
  const loaderPitch = (loaderContext, callback) => {
    if (loaderContext.loaderIndex >= loaders.length) {
      const resource = readEntryFile();
      loaderContext.loaderIndex--;
      loaderNormal.apply(loaderContext, [resource]);
      return;
    }
    let loader = loaders[loaderContext.loaderIndex];
    let pitch = loader.pitch;

    if (pitch) {
      let arg = pitch.apply(loaderContext, [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data]);
      // 如果有停止下一个pitch执行，结束返回上一个loader执行
      if (arg) {
        loaderContext.loaderIndex--;
        if (!Array.isArray(arg)) {
          arg = [arg];
        }
        loaderNormal.apply(loaderContext, arg);
      } else {
        loaderContext.loaderIndex++;
        loaderPitch(loaderContext, callback);
      }
    } else {
      loaderContext.loaderIndex++;
      loaderPitch(loaderContext, callback);
    }
  };

  // 启动pitch
  loaderPitch(loaderContext, callback);
}



// 完成loader的合并处理
// loader 分类 post后置，inline内置loader, normal普通loader, pre前置loader
// -! 非前置和普通loader
// ! 普通loader
// !! 非前置后置普通loader
const combineLoader = () => {
  // -!inline-loader1
  // !inline-loader2
  // ./styles.css资源
  const request = '-!inline-loader1!inline-loader2!./styles.css';
  let nodeModules = path.resolve(__dirname, "node_modules");
  let inlineLoaders = request.replace(/^-?!+/, '').replace(/!!+/g, '!').split('!');
  let resource = inlineLoaders.pop();
  let resolveLoader = (loader) => path.resolve(nodeModules, loader);
  // 得到loader绝对路径
  inlineLoaders = inlineLoaders.map(resolveLoader);

  let rules = [
    {
      enforce: "pre",
      test: /\.css?$/,
      use: ["pre-loader1", "pre-loader2"],
    },
    {
      test: /\.css?$/,
      use: ["normal-loader1", "normal-loader2"],
    },
    {
      enforce: "post",
      test: /\.css?$/,
      use: ["post-loader1", "post-loader2"],
    },
  ];
  // 前置
  let preLoaders = [];
  // 后置
  let postLoaders = [];
  // 普通
  let normalLoaders = [];

  // 循环得到匹配
  for(let i=0;i<rules.length;i++) {
    let rule = rules[i];
    if (rule.test.test(resource)) {
      if (rule.enforce === 'post') {
        postLoaders.push(...rule.use);
      } else if (rule.enforce === 'pre') {
        preLoaders.push(...rule.use);
      } else {
        normalLoaders.push(...rule.use);
      }
    }
  }
  postLoaders.map(resolveLoader);
  preLoaders.map(resolveLoader);
  normalLoaders.map(resolveLoader);

  // loader分类合并
  let loaders = [];
  if (request.startsWith('!!')) {
    loaders = inlineLoaders;
  } else if (request.startsWith('-!')) {
    loaders = [...postLoaders, ...inlineLoaders];
  } else if (request.startsWith('!')) {
    loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
  } else {
    loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
  }

  console.log(loaders);
};

// 简版合并参数
const options = {
  entry: '../src/index.js',
  loaders: [
    path.resolve(__dirname, '../loaders/babel-a'),
    path.resolve(__dirname, '../loaders/babel-b'),
    path.resolve(__dirname, '../loaders/babel-c')
  ]
}

loaderRunner(options, (error, result) => {
  if (error) {
    return console.warn(error);
  }
  console.log('result:', result);
})