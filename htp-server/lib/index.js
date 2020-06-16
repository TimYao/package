/*
  静态查询目录
*/
'use strict'

const path = require('path');
const fs = require('fs');
const url = require('url');
const mime = require('mime');
const ejs = require('ejs');
const debugDev = require('debug')('dev:libIndex');
const {getConfig} = require('../config/config');
let config;


const renderOptions = function(renderData){
  if (!config) {
    config = getConfig();
  }
  return Object.assign({}, renderData, {options: config})
}

const readDir = function(req, res, rootDir, pathname){
  let dirs;
  const dir = path.join(rootDir, pathname);
  try {
    const file = path.join(dir, 'index.html');
    if (fs.statSync(file).isFile()) {
      const extname = path.extname(dir).substring(1);
      res.setHeader('Content-Type', mime.getType(extname) + ';charset=utf8');
      return fs.createReadStream(dir).pipe(res);
    }
  } catch(e) {
    // debugDev(e);
    dirs = fs.readdirSync(dir);
    if (dirs.length > 0) {
      const tpl = fs.readFileSync(path.join(__dirname, '../template', 'index.html'), 'utf-8');
      dirs = dirs.reduce((arr, next, i) => {
        const ref = (pathname === '\/' ? '' : pathname) + '/' + next;
        arr[i] = {'filename': next, 'link': ref}
        return arr;
      },[]);
      let renderData = {data: dirs};
      renderData = renderOptions(renderData);
      res.end(ejs.render(tpl, renderData));
    } else {
      res.end('This dir is no file!')
    }
  }
}
const staticDir = function(req, res, rootDir, pathname){
  try{
    const dir = path.join(rootDir, pathname);
    const fd = fs.statSync(dir);
    if (fd.isFile()) {
      const extname = path.extname(dir).substring(1);
      res.setHeader('Content-Type', mime.getType(extname) + ';charset=utf8');
      return fs.createReadStream(dir).pipe(res);
    } else {
      readDir(req, res, rootDir, pathname);
    }
  }catch(e){
    debugDev(e);
    res.end('not found 404');
  }
}

exports.staticDir = staticDir