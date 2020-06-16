/*
  服务启动

  // todo
     1. 添加缓存控制（强制缓存与协商缓存）
     2. 添加编码压缩
     3. 文件时间展示与否
     4. 浏览器是否自动打开
*/
'use strict'

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
// const util = require('util');
const chalk = require('chalk');
const mime = require('mime');
const debugDev = require('debug')('dev:main');
const config = require('./bin/www');
const {mergeOptions} = require('./config/config');
const {staticDir} = require('./lib/index');

const log = console.log;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

const baseCache = {}
if (process.env.NODE_ENV === 'production') {
  debugDev.enabled = false;
} else {
  // start(config);
}

/*
   如何启动后获取服务器地址
*/

function start(config){
  const port = config.port;
  mergeOptions(config);
  const server = http.createServer();
  server.listen(port, config.address, () => {
    log(chalk.green('Welcome you use', config.pkgName));
    if (config.port !== port) {
      log(warning(`port ${config.port} is occupy, restart server`));
    }
    log(chalk.yellow(`please visit http://${config.address}:${port}`))
  })

  // server request
  server.on('request', (req, res) => {
    let cwd = process.cwd();
    let {pathname} = url.parse(req.url);

    if (pathname.includes('\/favicon.ico')) {
      res.end();
      return;
    }

    let rootDir;
    if (!baseCache.rootDir) {
      try{
        rootDir = path.join(cwd, 'public');
        fs.statSync(rootDir);
      }catch(e){
        debugDev(e);
        rootDir = cwd;
      }
      baseCache.rootDir = rootDir;
    } else {
      rootDir = baseCache.rootDir
    }

    staticDir(req, res, rootDir, pathname);
  })

  server.on('error', (err) => {
    debugDev(err);
    // 若端口被占用
    if(err.code === 'EADDRINUSE'){
      server.listen(config.port++);
    }
  })
}

module.exports = start;