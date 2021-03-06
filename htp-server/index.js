'use strict'

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const chalk = require('chalk');
const debugDev = require('debug')('dev:htp-server');
const {getConfig} = require('./config/config');
const {staticDir} = require('./lib/index');

const log = console.log;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

const baseCache = {}
if (process.env.NODE_ENV === 'production') {
  debugDev.enabled = false;
}

function start(){
  const config = getConfig();
  const port = config.port;
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

  // server error
  server.on('error', (err) => {
    debugDev(err);
    // 若端口被占用
    if(err.code === 'EADDRINUSE'){
      server.listen(config.port++);
    }
  })
}

start();
