const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const mime = require('mime');
const {getConfig} = require('../config/config');
const config = getConfig();
const {getKey} = require('./utils');

const fileReg = /(\.js|\.css|\.jpe?g|\.gif|\.png|\.woff|\.txt|\.woff2)/;

// console.log('config:', config);

const setHeader = exports.setHeader = (res, headers) => {
  headers.forEach(head => {
    const keys = Object.keys(head);
    keys.forEach((key) => {
      console.log('header:', key, ':', head[key]);
      res.setHeader(key, head[key]);
    })
  });
};

// whether start gzip or stop gzip
const setGzip = exports.setGzip = (req) => {
  const acceptEncoding = req.headers['accept-encoding'];
  const gzipInfo = {};
  if (!acceptEncoding) {
      acceptEncoding = '';
      gzipInfo = undefined;
      return gzipInfo;
  }
  const zlib = require('zlib');
  gzipInfo.header = {};
  if (acceptEncoding.match(/\bdeflate\b/)) {
    gzipInfo.zlib = zlib.createDeflate;
    gzipType = 'deflate';
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    gzipInfo.zlib = zlib.createGzip;
    gzipType = 'gzip';
  }
  gzipType && (gzipInfo.header['Content-Encoding'] = gzipType);
  return gzipInfo;
};

// whether start cache or stop gzip
const setCache = exports.setCache = (req, time) => {
  const {pathname} = url.parse(req.url);
  const ext = path.extname(pathname);
  const stat = req.stat;
  let cacheInfo = {};
  let cacheControl;
  time = Number(time);
  cacheInfo.headers = [];

  if (fileReg.test(ext)) {
    const expires = new Date(Date.now() + (time * 1000)).toGMTString();
    cacheControl = 'max-age=' + time;
    cacheInfo.headers.push({'Expires': expires});
  } else {
    cacheControl = 'no-cache';
  }
  cacheInfo.headers.push({'Cache-Control': cacheControl});
  const lastModifiedTime = stat.ctime.toGMTString();
  cacheInfo.headers.push({'Last-Modified': lastModifiedTime});
  const eTag = crypto.createHash('md5').update(String(stat.size)).digest('base64');
  cacheInfo.headers.push({'Etag': eTag});
  return cacheInfo
};

const matchCache = (req, headers) => {
  const stat = req.stat;
  const ifLastModifiedSince = req.headers['if-modified-since'];
  const ifNoneMatch = req.headers['if-none-match'];
  const clientLastModifiedSince = stat.ctime.toGMTString();
  const getETag = getKey(headers);
  const clientETag = getETag('Etag')[0]['Etag'];
  let cacheInfo = false;
  if ((clientETag === ifNoneMatch) || (ifLastModifiedSince === clientLastModifiedSince)) {
    cacheInfo = true;
  }
  return cacheInfo;
};


// write file
const pipe = exports.pipe = (req, res, content) => {
  const method = req.method.toLowerCase();
  if (method !== 'get') return;
  const extname = path.extname(content).substring(1);
  const headers = [];
  // extname && (headers.push({'Content-Type': mime.getType(extname) + ';charset=utf8'}))
  let gzip = config.gzip;
  gzip && (gzip = setGzip(req), gzip && headers.push(gzip.header))
  let cache = 'cache' in config;
  cache && (cache = setCache(req, config.cache), cache && headers.push(...cache.headers))
  // setHeader(res, headers);
  // const cacheInfo = cache && matchCache(req, cache.headers);
  // console.log(cacheInfo);
  res.setHeader('Content-type', extname + '; charset=utf-8');
  res.setHeader('Expires', new Date(Date.now()+20000).toGMTString());
  res.setHeader('Cache-Control', 'max-age=20');
  res.setHeader('Last-Modified', req.stat.ctime.toGMTString());
  const etag = crypto.createHash('md5').update(String(req.stat.size)).digest('base64');
  res.setHeader('Etag', etag);
  // const getETag = getKey(headers);
  // const clientETag = getETag('Etag')[0]['Etag'];
  const ifLastModifiedSince = req.headers['if-modified-since'];
  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch === etag || ifLastModifiedSince === req.stat.ctime.toGMTString()) {
    res.statusCode = 304;
    res.end();
  } else {
    fs.createReadStream(content).pipe(res);
  }

  // if (cacheInfo) {
  //   res.statusCode = 304;
  //   return res.end();
  // } else {
  //   res.statusCode = 200;
  // }

  // if (gzip.zlib) {
  //   fs.createReadStream(content).pipe(gzip.zlib()).pipe(res);
  // } else {
  //   fs.createReadStream(content).pipe(res);
  // }
}

exports.feature = () => {
  const feature = {setHeader, pipe, setGzip, setCache};
  return feature;
}


